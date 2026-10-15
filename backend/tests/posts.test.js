const request = require('supertest');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./testDb');

let app;

const registerUser = async (pseudonym) => {
  const res = await request(app)
    .post('/auth/register')
    .send({ pseudonym, password: 'password123' });
  return res.body.token;
};

beforeAll(async () => {
  await connectTestDb();
  app = require('../server');
}, 35000);

afterEach(clearTestDb, 35000);
afterAll(disconnectTestDb, 35000);

describe('post safety-critical flagging', () => {
  // Safety-critical: this is the only gate before content reaches the public
  // feed. If this test starts failing, do not weaken it to make it pass —
  // the risk-keyword check in postController.js is what it's guarding.
  test('a post containing a risk keyword is flagged and hidden from the public feed', async () => {
    const token = await registerUser('test_riskcheck');

    const createRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'mental_health', content: 'I keep thinking I want to die.' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.flagged).toBe(true);
    expect(createRes.body.status).toBe('under_review');

    const feedRes = await request(app).get('/posts');
    const ids = feedRes.body.posts.map((post) => post._id);
    expect(ids).not.toContain(createRes.body._id);
  });

  test('a normal post is not flagged and does appear in the public feed', async () => {
    const token = await registerUser('test_normalpost');

    const createRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'gratitude', content: 'Small win: I finished a task I had been avoiding.' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.flagged).toBe(false);
    expect(createRes.body.status).toBe('visible');

    const feedRes = await request(app).get('/posts');
    const ids = feedRes.body.posts.map((post) => post._id);
    expect(ids).toContain(createRes.body._id);
  });

  test('creating a post without a token is rejected', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ category: 'mental_health', content: 'No token attached.' });

    expect(res.status).toBe(401);
  });
});

describe('post reactions', () => {
  test('reacting, switching type, and un-reacting all update counts correctly', async () => {
    const authorToken = await registerUser('test_reactauthor');
    const reactorToken = await registerUser('test_reactor');

    const createRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ category: 'gratitude', content: 'A post other people will react to.' });
    const postId = createRes.body._id;

    const first = await request(app)
      .patch(`/posts/${postId}/react`)
      .set('Authorization', `Bearer ${reactorToken}`)
      .send({ type: 'heard' });
    expect(first.status).toBe(200);
    expect(first.body.counts).toEqual({ heard: 1, support: 0, beenthere: 0 });
    expect(first.body.userReaction).toBe('heard');

    const switched = await request(app)
      .patch(`/posts/${postId}/react`)
      .set('Authorization', `Bearer ${reactorToken}`)
      .send({ type: 'support' });
    expect(switched.body.counts).toEqual({ heard: 0, support: 1, beenthere: 0 });
    expect(switched.body.userReaction).toBe('support');

    const removed = await request(app)
      .patch(`/posts/${postId}/react`)
      .set('Authorization', `Bearer ${reactorToken}`)
      .send({ type: 'support' });
    expect(removed.body.counts).toEqual({ heard: 0, support: 0, beenthere: 0 });
    expect(removed.body.userReaction).toBeNull();
  });

  test('an invalid reaction type is rejected', async () => {
    const token = await registerUser('test_badreaction');
    const createRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'gratitude', content: 'Post for the invalid-type test.' });

    const res = await request(app)
      .patch(`/posts/${createRes.body._id}/react`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'love' });

    expect(res.status).toBe(400);
  });
});

describe('category counts', () => {
  test('only counts visible posts, grouped by category', async () => {
    const token = await registerUser('test_categorycounts');

    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'gratitude', content: 'Visible gratitude post for counting.' });
    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'mental_health', content: 'I keep thinking I want to die.' }); // flagged, excluded

    const res = await request(app).get('/posts/category-counts');
    expect(res.status).toBe(200);
    expect(res.body.gratitude).toBe(1);
    expect(res.body.mental_health || 0).toBe(0);
  });
});
