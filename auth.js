// GitHub 로그인 시작점. 사용자를 GitHub 인증 화면으로 보냅니다.
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const host = req.headers.host;
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const redirectUri = `${proto}://${host}/api/callback`;
  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    scope: "repo,user",
    state: Math.random().toString(36).slice(2),
  });
  res.statusCode = 302;
  res.setHeader("Location", `https://github.com/login/oauth/authorize?${params.toString()}`);
  res.end();
}
