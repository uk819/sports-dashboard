/*
 * @Description: 开发环境配置
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-15 16:52:22
 * @LastEditors: Passion.KMG
 */
const _ = require('lodash');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackLoader = require('./projects.config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const authToken = '030b6beecadef6f197c6800f3b0f8b155b0b839390ab509ad0129ea9914a21e5';

const sentryServerUrl = 'http://www.p619tp.com';

makeConf = require('./dynamicTsconfig');

module.exports = (env) => {
  const _sentry_version = `${env.alias}-${_.now()}`;
  const apiVer = env.env;
  if(!_.includes(['uat', 'dev', 'prod'], apiVer)){
    console.error(`#ERROR: 未知的打包参数，只能是uat, dev, prod中的一个，当前参数为：${apiVer}`);
    return;
  };
  const CONFIG = webpackLoader(env.alias.split('-')[0],env.alias.split('-')[1]);
  makeConf({myPath: CONFIG.base, client: CONFIG.client});
  return {
    devtool: 'source-map',
    stats: {warnings:false},
    entry: {
      bootstrap: `./src/views/${CONFIG.base}/assets/bootstrap.ts`,
      index: `./src/views/${CONFIG.entry}/index.tsx`
    },
    output: {
      path: CONFIG.buildPath,
      publicPath: `/`,
      filename: `static/javascript/[name].[contenthash:8].js`,
      chunkFilename: `static/javascript/chunk.[name].[contenthash:8].js`,
      clean: true
    },
    plugins: [
      sentryWebpackPlugin({
        url: sentryServerUrl,
        org: 'dpty',
        project: CONFIG.client==='desktop'?'dp-web':'dp-h5',
        authToken,
        release: {
          name: _sentry_version,
          uploadLegacySourcemaps:{
            urlPrefix: '~/',
            paths:CONFIG.client==='desktop'?['./dist/dpgames-web']:['./dist/dpgames-h5']
          }
        },
        sourcemaps: {
          assets:CONFIG.client==='desktop'?'./dist/dpgames-web':'./dist/dpgames-h5',
          ignore: ['node_modules'],
          // filesToDeleteAfterUpload:'./dist/**/*.map'
        },
        debug:true,
        errorHandler: (err) => {
          console.warn(err);
        }
      }),
      new HtmlWebpackPlugin({
        meta: CONFIG.client === 'mobile' ? {
          'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0',
        } : { },
        template: `src/views/${CONFIG.base}/assets/index.ejs`,
        chunks: ['vendors', 'index', 'bootstrap'],
        filename: `${CONFIG.buildPath}/${CONFIG.htmlName}`,
        date: new Date(),
        minify: false
      }),
      new CopyWebpackPlugin([{
        from: `src/views/${CONFIG.base}/assets/images/favicon.ico`,
        to:  `${CONFIG.buildPath}/favicon.ico`
      }]),
      new MiniCssExtractPlugin({
        filename: `static/styles/[name].[contenthash:8].css`,
        chunkFilename: `static/styles/[id].[contenthash:8].css`
      }),
      new webpack.ProvidePlugin({
        'window.$I18N_FILE': [path.resolve(__dirname, `../src/views/${CONFIG.base}/assets/language/index`), 'default'],
        _: 'lodash',
        React: 'react',
        ReactDom: 'react-dom',
      }),
      new webpack.DefinePlugin({
        '__DEV_MODE__': false,
        '__API_VERSION__': `"${apiVer}"`,
        '__DB_VERSION__': _.now(),
        'process.env.PLATFORM': `"${CONFIG.base}"`,
        'process.env.CLIENT_MODE': `"${CONFIG.client}"`,
        'process.env.DOMAIN': `"${CONFIG.api[CONFIG.client][apiVer]}"`,
        'process.env.PLATFORM_NAME': `"${CONFIG.name}"`,
        'process.env.API_PREFIX': `"${CONFIG.apiVersion}"`,
        'process.env.SENTRY_RELEASE_VERSION': JSON.stringify(_sentry_version)
      }),
      // new BundleAnalyzerPlugin()
    ],
    // externals: {
    //   'react': 'React',
    //   'react-dom': 'ReactDOM',
    //   'lodash': '_',
    //   'jsencrypt': 'JSEncrypt',
    //   'axios': 'axios',
    //   'preact': 'preact'
    // },
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.js[x]?$/,
          resolve: {
            fullySpecified: false,
          },
          use: ['babel-loader'],
          include: /src/,
          exclude: /node_modules/
        },
        {
          test: /\.ts[x]?$/,
          resolve: {
            fullySpecified: false,
          },
          use: ['ts-loader'],
          include: /src/,
          exclude: /node_modules/
        },
        {
          test: /\.(scss|css)$/,
          use: CONFIG.client === 'mobile' ?
          [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: 'global',
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
            }
          ]
          :
          [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: 'global',
              }
            },
            {
              loader: 'sass-loader',
            }
          ]
        },
        {
          test: /\.(jpg|jpe?g|png|webp|gif|mp4)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 512,
                esModule: false,
                outputPath: `static/images/`,
                name: '[name].[hash:4].[ext]'
              }
            }
          ],
          type: 'javascript/auto',
          exclude: path.join(__dirname, `../src/views/${CONFIG.base}/public/i/`)
        },
        {
          test: /\.(jpg|jpe?g|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 512,
                esModule: false,
                outputPath: `static/images/`,
                name: '[name].[hash:4].[ext]'
              }
            }
          ],
          type: 'javascript/auto',
          include: path.join(__dirname, `../src/views/${CONFIG.base}/public/i/`)
        },
        {
          test: /\.(mp3|wav)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                outputPath: `static/media`,
                esModule: false,
                name: '[name].[hash:4].[ext]'
              }
            }
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.(htm|html)$/,
          use: 'html-withimg-loader'
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: `static/svg`,
                name: '[name].[hash:4].[ext]',
                esModule: false
              }
            }
          ],
          type: 'javascript/auto',
        },
        {
          test: /\.(ttf|eot|woff|woff2|otf)(\?.*$|$)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: `static/fonts`,
                name: '[name].[hash:4].[ext]',
                esModule: false
              }
            }
          ],
          type: 'javascript/auto',
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.tsx', '.ts'],
      alias: {
        '@': path.join(__dirname, '../src'),
        '@core': path.join(__dirname, '../src/core'),
        '@views': path.join(__dirname, '../src/views'),
        '@template': path.join(__dirname, `../src/core/templates/${CONFIG.client}`),
        '@configs': path.join(__dirname, '../src/core/constants/configs'),
        '@helpers': path.join(__dirname, '../src/core/helpers'),
        '@constants': path.join(__dirname, '../src/core/constants'),
        '@actions': path.join(__dirname, '../src/core/actions'),
        '@schemas': path.join(__dirname, '../src/core/schemas'),
        '@libs': path.join(__dirname, '../src/core/libs'),
        '@hooks': path.join(__dirname, '../src/core/hooks'),
        '@models': path.join(__dirname, '../src/core/apis/models'),
        "@mocks": path.join(__dirname, `../src/views/${CONFIG.base}/assets/mock`),
        '@style': path.join(
          __dirname,
          `../src/core/templates/${CONFIG.client}/styles`
        ),
        '@my': path.join(__dirname, `../src/views/${CONFIG.base}`),
        '@this': path.join(__dirname, `../src/views/${CONFIG.base}/${CONFIG.client}`),
        'moment': 'dayjs'
      }
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            },
            output: {
              ascii_only: true
            }
          }
        })
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10
          }
        }
      }
    },
  }
};
