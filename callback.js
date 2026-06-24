// GitHub가 돌려준 코드를 토큰으로 바꿔, 관리자(CMS) 창에 전달합니다.
export default async function handler(req, res) {
  try {
    let code = req.query && req.query.code;
    if (!code) {
      code = new URL(req.url, "http://x").searchParams.get("code");
    }
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    const content = data.access_token
      ? "authorization:github:success:" + JSON.stringify({ token: data.access_token, provider: "github" })
      : "authorization:github:error:" + JSON.stringify(data);

    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>
(function(){
  var data = ${JSON.stringify(content)};
  function receive(e){
    if (window.opener) window.opener.postMessage(data, e.origin);
    window.removeEventListener("message", receive, false);
  }
  window.addEventListener("message", receive, false);
  if (window.opener) window.opener.postMessage("authorizing:github", "*");
})();
</script>
<p style="font-family:sans-serif">로그인 처리 중… 이 창은 자동으로 닫힙니다.</p>
</body></html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.statusCode = 200;
    res.end(html);
  } catch (err) {
    res.statusCode = 500;
    res.end("Auth error: " + (err && err.message));
  }
}
