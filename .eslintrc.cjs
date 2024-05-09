module.exports = {
    // 指定的规范，去检查指定类型的文件
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    // 可以使用 plugin 定义自己的规则，引入 plugin 可以理解为引入了额外的 rules，需要在 rules、extends 中定义后才会生效
    plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/react-in-jsx-scope': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
