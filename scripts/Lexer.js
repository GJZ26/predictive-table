export default class PseudoLexer {
    code = "";

    constructor(code) {
        this.code = code;
    }

    getTokens() {
        let res = this.code
            .replace(/\{(\s*)\}/g, '{}')
            .replace(/\s+/g, ' ')
            .replace(/(:|{}|,|\(|\)|;|>|<|==|!=)/g, ' $1 ')
            .replace(/\s+/g, ' ')
            .trim().split(" ").filter((token) => token !== "");
        res.push("$")
        return res
    }
}
