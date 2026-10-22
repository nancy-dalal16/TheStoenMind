export const postHref = (post) => `/explore/${post.slug}`;
export const topicHref = (topic) => (topic ? `/explore/topic/${topic.slug}` : "/explore");
