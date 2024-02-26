/*
 *   Main.js
 *
 *   Este Script es el encargado de cargar los recursos
 *   como la grámitica, inicializar clases y coordinar
 *   la ejecución del código.
 *
 *   Este script está diseñado para funcionar únicamente
 *   con el HTML proporcionado, no debe ser usado o implementado
 *   en ningún otro proyecto :)
 */

import PseudoLexer from "./Lexer.js";
import tablePredictive from '../data/predictive.json' assert {type: 'json'}
import Predictive from "./predictive.js";

const visual_output = document.getElementById("program-output");
const input = document.getElementById("input-checker");
const btn = document.getElementById("check");
const log = document.getElementById('log')

visual_output.innerHTML = '';

function validationHandler(e) {

    const lexerInstance = new PseudoLexer(input.value)
    const tokens = lexerInstance.getTokens()

    visual_output.innerHTML = '';

    const current_queue = document.createElement('div')
    const input_queue = document.createElement('div')

    visual_output.appendChild(current_queue)
    visual_output.appendChild(input_queue)

    current_queue.className = "outqueue"
    input_queue.className = "inqueue"

    const predictiveInstance = new Predictive(
        structuredClone(tablePredictive), tokens, "REPETITIVA"
    )
    predictiveInstance.registerVisuals(input_queue, current_queue, log);
    predictiveInstance.renderInput()

    function loop() {
        if (!predictiveInstance.next()) {
            e.target.disabled = false
            return
        };
        setTimeout(() => { loop() }, 200)
    }

    loop(e)
}

btn.addEventListener("click", (e) => {
    e.target.disabled = true
    validationHandler(e)
})
