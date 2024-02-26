export default class Predictive {

    CURRENT_CALL = 0
    MAX_CALL = 10

    /**
     * 
     * @param {object} predictive_rules Reglas de la tabla predictiva
     * @param {Array<string>} tokens 
     */
    constructor(predictive_rules, tokens, initial_symbol) {
        this.predictive_rules = predictive_rules;
        this.tokens = tokens
        this.initial_symbol = initial_symbol
        console.log(this.tokens)
        console.table(this.predictive_rules)
        this.queue = []
    }

    renderInput() {

        this.visual_input.innerHTML = ''
        this.visual_output.innerHTML = ''

        for (let i in this.tokens) {
            const a = document.createElement("span")
            a.textContent = this.tokens[i]
            this.visual_input.appendChild(a)
        }

        for (let i in this.queue) {
            for (let j in this.queue[i]) {
                const a = document.createElement("span")
                a.textContent = this.queue[i][j].val
                this.visual_output.appendChild(a)
            }
        }
    }

    next() {
        this.renderInput()
        const current_token = this.tokens.shift()

        if (current_token === "$") {
            if(this.queue.length === 0 && this.tokens.length === 0){
                this.visual_input.firstChild.classList.add("success")
                this.__say("Entrada válida!", "SUCCESS")
                return false
            }
            return this.__sayError("Entrada ilegal")
        }

        if (this.queue.length == 0) {
            return this.__searchForInitialRefernces(current_token)
        }

        let result = this.__extenseQueue(current_token, this.__coolPop())

        return result
    }

    __say(msg, type) {
        let clases = ""
        if (type == "SUCCESS") clases = "succes"
        if (type == "ERROR") clases = "error"

        this.log.className = clases
        this.log.textContent = msg
    }

    __searchForInitialRefernces(token) {
        let initial_set_rule = this.predictive_rules[this.initial_symbol]
        for (let key in initial_set_rule) {
            let reg_rule = new RegExp(this.__escapeRegExp(key))

            if (reg_rule.test(token)) {
                console.log(token, reg_rule)

                if (this.predictive_rules[this.initial_symbol][key] === null) {
                    return this.__sayError("Token no encontrado.")
                }

                this.queue.push(this.predictive_rules[this.initial_symbol][key])
                return true
            }
        }
        return this.__sayError("Token no encontrado.")
    }

    __sayError(msg) {
        this.visual_input.firstChild.classList.add("wrong")
        this.log.className = "error"
        
        console.error(msg)
        this.log.textContent = msg
    }

    __coolPop() {
        let res = this.queue[this.queue.length - 1].shift()
        if (this.queue[this.queue.length - 1].length <= 0) {
            this.queue.pop();
        }
        return res
    }

    __extenseQueue(token, ref) {

        if (ref === null) {
            return this.__sayError("Error de referencia.")
        }

        if (ref.type === "REF") {
            let initial_set_rule = this.predictive_rules[ref.val]
            for (let key in initial_set_rule) {
                let reg_rule = new RegExp(this.__escapeRegExp(key))
                if (reg_rule.test(token)) {
        
                    if (this.predictive_rules[ref.val][key] === null) {
                        return this.__sayError("Entrada inesperada")
                    }

                    if (this.predictive_rules[ref.val][key].length > 0) {
                        this.queue.push(this.predictive_rules[ref.val][key])
                    }

                    return true
                }
            }
            return this.__sayError("Token inválido: " + token)
        }

        let a = new RegExp(this.__escapeRegExp(ref.val))

        return a.test(token)

    }


    __escapeRegExp(str) {
        if (str === "[a-zA-Z]") {
            return "^[A-Za-z]+$"
        }
        if (str === "^do$") {
            return "^do$"
        }
        if (str === "true") {
            return "^true$"
        }
        if (str === "false") {
            return "^false$"
        }
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    /**
     * 
     * @param {HTMLDivElement} visual_input Queue input
     * @param {HTMLDivElement} visual_output Queue analizing
     * @param {HTMLSpanElement} log Log
     */
    registerVisuals(visual_input, visual_output, log) {
        this.visual_input = visual_input
        this.visual_output = visual_output
        this.log = log
    }
}