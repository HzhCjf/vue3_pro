import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import {resolve} from 'path'

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    // mode 接收两个值：development、production
    // development：开发，npm run dev 这个mode 使用的 development，vite 会为 开发环境配置对应策略
    // production：生产，npm run build 这个 mode 使用的事就是 production
    // 当我们运行 vite 命令的时候，会自动加载根目录下已 .env 开头的文件
    // mode: 'development',
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': resolve(__dirname, "src"),
      },
      extensions: [".ts", ".vue", ".js", ".jsx", ".tsx"], // 导入时想要省略的扩展名列表。
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: '@import "./src/styles/variables.scss";',
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },

    // 配置请求代理
    server: {
      proxy: {
        // 最基础的配置
        // 'http://localhost:3000/user': 'http://stguigu.com/user',
        // 'http://localhost:3000/login': 'http://stguigu.com/login'

        // http://localhost:3000/user => http://stguigu.com/user
        // 'http://localhost:3000/user': {
        //   // target 替换掉源url的域名部分
        //   target: 'http://stguigu.com'
        // }


        // http://localhost:3000/api/user => http://stguigu.com/api/user => http://stguigu.com/user
        // http://localhost:3000/api/login => http://stguigu.com/api/login => http://stguigu.com/login
        '/app-dev': {
          target: 'http://gmall-h5-api.atguigu.cn',
          // pathRewrite: {
          //   '^/app-dev': ''
          // },
          // vite => rewrite
          rewrite: (path) => path.replace(/^\/app-dev/, ''),
          changeOrigin: true
        }
      }
    }
  };
});
