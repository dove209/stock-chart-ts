const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        '/naverAPI',
        createProxyMiddleware({
            target: 'https://api.finance.naver.com',
            pathRewrite: {
                '^/naverAPI':''
              },
            changeOrigin: true
        })
    );
    app.use(
        '/dartAPI',
        createProxyMiddleware({
            target: 'https://opendart.fss.or.kr/api',
            pathRewrite: {
                '^/dartAPI':''
              },
            changeOrigin: true
        })
    )
}