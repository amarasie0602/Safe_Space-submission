const request = require('supertest');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./testDb');
const User = require('../models/User');

let app;

beforeAll(async () => {
  await connectTestDb();
  app = require('../server');
}, 35000);

afterEach(clearTestDb, 35000);
afterAll(disconnectTestDb, 35000);

const registerAndLogin = async (pseudonym) => {
  const res = await request(app)
    .post('/auth/register')
    .send({ pseudonym, password: 'password123' });
  return res.body.token;
};

// A JWT is stateless — it carries the role it was issued with, so promoting
// a user's role in the DB does nothing until they get a fresh token.
const login = async (pseudonym) => {
  const res = await request(app)
    .post('/auth/login')
    .send({ pseudonym, password: 'password123' });
  return res.body.token;
};

const makeModerator = async (pseudonym) => {
  await registerAndLogin(pseudonym);
  await User.updateOne({ pseudonym }, { role: 'moderator' });
  return login(pseudonym);
};

const makeAdmin = async (pseudonym) => {
  await registerAndLogin(pseudonym);
  await User.updateOne({ pseudonym }, { role: 'admin' });
  return login(pseudonym);
};

describe('moderator vs admin permission split', () => {
  // Day-to-day moderation (flagged posts, reports) is open to moderators —
  // this is the whole point of having the role.
  test('a moderator can reach the flagged posts queue and the reports queue', async () => {
    const modToken = await makeModerator('test_mod_posts');

    const posts = await request(app).get('/admin/posts').set('Authorization', `Bearer ${modToken}`);
    expect(posts.status).toBe(200);

    const reports = await request(app).get('/admin/reports').set('Authorization', `Bearer ${modToken}`);
    expect(reports.status).toBe(200);
  });

  // The most sensitive actions stay admin-only even for a moderator token.
  test('a moderator is rejected from analytics, counselor verification, and banning a user', async () => {
    const modToken = await makeModerator('test_mod_sensitive');
    const targetToken = await registerAndLogin('test_mod_target');
    const target = await User.findOne({ pseudonym: 'test_mod_target' });
    void targetToken;

    const analytics = await request(app).get('/admin/analytics').set('Authorization', `Bearer ${modToken}`);
    expect(analytics.status).toBe(403);

    const pending = await request(app)
      .get('/admin/counselors/pending')
      .set('Authorization', `Bearer ${modToken}`);
    expect(pending.status).toBe(403);

    const ban = await request(app)
      .patch(`/admin/users/${target._id}/ban`)
      .set('Authorization', `Bearer ${modToken}`);
    expect(ban.status).toBe(403);
  });

  test('a plain user is rejected from both the moderator-level and admin-only routes', async () => {
    const userToken = await registerAndLogin('test_plain_user');

    const posts = await request(app).get('/admin/posts').set('Authorization', `Bearer ${userToken}`);
    expect(posts.status).toBe(403);

    const analytics = await request(app).get('/admin/analytics').set('Authorization', `Bearer ${userToken}`);
    expect(analytics.status).toBe(403);
  });
});

describe('admin audit log', () => {
  test('banning a user writes a traceable audit log entry', async () => {
    const adminToken = await makeAdmin('test_audit_admin');
    await registerAndLogin('test_audit_target');
    const target = await User.findOne({ pseudonym: 'test_audit_target' });

    const banRes = await request(app)
      .patch(`/admin/users/${target._id}/ban`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Repeated harassment of other users' });
    expect(banRes.status).toBe(200);

    const log = await request(app).get('/admin/actions').set('Authorization', `Bearer ${adminToken}`);
    expect(log.status).toBe(200);

    const entry = log.body.find((e) => e.action === 'user_banned' && e.targetId === String(target._id));
    expect(entry).toBeTruthy();
    expect(entry.actor.pseudonym).toBe('test_audit_admin');
    expect(entry.reason).toBe('Repeated harassment of other users');
  });

  test('the audit log is admin-only, not open to a moderator', async () => {
    const modToken = await makeModerator('test_audit_mod');
    const res = await request(app).get('/admin/actions').set('Authorization', `Bearer ${modToken}`);
    expect(res.status).toBe(403);
  });
});

describe('counselor application review', () => {
  const registerCounselor = (email) =>
    request(app).post('/counselors/register').send({
      name: 'Dr. Test Applicant',
      email,
      password: 'password123',
      specialties: ['mental_health'],
      credentials: 'Licensed Clinical Psychologist, 8 years practice',
    });

  test('a newly registered counselor appears in the pending review queue, not the public list', async () => {
    const adminToken = await makeAdmin('test_review_admin');
    await registerCounselor('pending.counselor@example.com');

    const publicList = await request(app).get('/counselors');
    expect(publicList.body.some((c) => c.name === 'Dr. Test Applicant')).toBe(false);

    const pending = await request(app)
      .get('/admin/counselors/pending')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(pending.status).toBe(200);
    const applicant = pending.body.find((c) => c.email === 'pending.counselor@example.com');
    expect(applicant).toBeTruthy();
    expect(applicant.credentials).toBe('Licensed Clinical Psychologist, 8 years practice');
    expect(applicant.passwordHash).toBeUndefined();
  });

  test('verifying a counselor moves them into the public list and logs the action', async () => {
    const adminToken = await makeAdmin('test_verify_admin');
    const { body: counselor } = await registerCounselor('verify.counselor@example.com');

    const verifyRes = await request(app)
      .post(`/admin/counselors/verify/${counselor.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.verified).toBe(true);

    const publicList = await request(app).get('/counselors');
    expect(publicList.body.some((c) => c.name === 'Dr. Test Applicant')).toBe(true);

    const log = await request(app).get('/admin/actions').set('Authorization', `Bearer ${adminToken}`);
    expect(log.body.some((e) => e.action === 'counselor_verified')).toBe(true);
  });

  test('rejecting a counselor removes the application and logs a snapshot of who was rejected', async () => {
    const adminToken = await makeAdmin('test_reject_admin');
    const { body: counselor } = await registerCounselor('reject.counselor@example.com');

    const rejectRes = await request(app)
      .post(`/admin/counselors/reject/${counselor.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Credentials could not be verified' });
    expect(rejectRes.status).toBe(204);

    const pending = await request(app)
      .get('/admin/counselors/pending')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(pending.body.some((c) => c.email === 'reject.counselor@example.com')).toBe(false);

    const log = await request(app).get('/admin/actions').set('Authorization', `Bearer ${adminToken}`);
    const entry = log.body.find((e) => e.action === 'counselor_rejected');
    expect(entry).toBeTruthy();
    expect(entry.metadata.email).toBe('reject.counselor@example.com');
    expect(entry.reason).toBe('Credentials could not be verified');
  });
});

describe('report visibility for staff', () => {
  test('a report shows the reporter\'s pseudonym to staff, never their password/credentials', async () => {
    const reporterToken = await registerAndLogin('test_reporter_person');
    const modToken = await makeModerator('test_report_mod');
    const { body: targetUser } = await request(app)
      .post('/auth/register')
      .send({ pseudonym: 'test_reported_person', password: 'password123' });

    await request(app)
      .post('/reports')
      .set('Authorization', `Bearer ${reporterToken}`)
      .send({ targetType: 'user', targetId: targetUser.user.id, reason: 'Repeated harassment' });

    const res = await request(app).get('/admin/reports').set('Authorization', `Bearer ${modToken}`);
    expect(res.status).toBe(200);
    const report = res.body.find((r) => r.reason === 'Repeated harassment');
    expect(report.reporter.pseudonym).toBe('test_reporter_person');
    expect(report.reporter.passwordHash).toBeUndefined();
  });
});
