// A post's reaction count is just the length of its reactions array
// (one entry per user, regardless of type) — shared so "most supported"
// sorting and featured-post selection use the exact same number.
export const totalReactions = (post) => (post.reactions || []).length;

// Picks which post to show as "Featured" on the homepage. No stored
// "featured" flag anywhere — this is a transparent, re-computed rule over
// whatever's currently loaded: most total reactions, ties broken by reply
// count when available, then most recent. Returns null for an empty list.
export const pickFeaturedPost = (posts) => {
  if (!posts || posts.length === 0) return null;

  return [...posts].sort((a, b) => {
    const reactionDiff = totalReactions(b) - totalReactions(a);
    if (reactionDiff !== 0) return reactionDiff;

    const replyDiff = (b.replyCount || 0) - (a.replyCount || 0);
    if (replyDiff !== 0) return replyDiff;

    return new Date(b.createdAt) - new Date(a.createdAt);
  })[0];
};
