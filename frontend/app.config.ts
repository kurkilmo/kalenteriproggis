
export default ({ config }) => ({
    ...config,
    extra: {
        DIST: process.env.DIST
    },
});
