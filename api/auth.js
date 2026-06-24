// GitHub 로그인 시작점. 사용자를 GitHub 인증 화면으로 보냅니다.
// Client ID는 비밀이 아니라 직접 적어둡니다. 환경변수가 있으면 그걸 쓰되, 공백은 제거합니다.
export default function handler(req, res) {
  const clientId = (process.env.GITHUB_CLIENT_ID || "Ov23likypO2NCK5U1Mvq").trim();
  const host = req.headers.host;
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const redirectUri = `${proto}://${host}/api/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state: Math.random().toString(36).slice(2),
  });
  res.statusCode = 302;
  res.setHeader("Location", `https://github.com/login/oauth/authorize?${params.toString()}`);
  res.end();
}
