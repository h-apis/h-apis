export default {
    escapeTitle(title: string) {
        return title
            .replace(/[ ]/g, '_')
            .replace(/[&/\\#,+()$~%.'":*?<>{}|]/g, '+')
    }
}
