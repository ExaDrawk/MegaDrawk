const config = {
    default: {
        type: 'function',
        wrapper: '@opennextjs/cloudflare',
        converter: '@opennextjs/cloudflare',
    },
    buildCommand: "npm run build:next",
};

export default config;
