export default async (req, res) => {
  const { reqHandler } = await import('../dist/mvp/server/server.mjs');
  return reqHandler(req, res);
};
