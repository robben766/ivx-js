import onChange from "./_settings.on-change.js";
import inputAfterHTML from "./templates/after.html";
import inputBeforeHTML from "./templates/before.html";
import inputLabel from "./templates/label.html";



const settings = {
    id: "firstname",
    type: "text",
    name: "firstname",
    onChange: [...onChange],
    beforeHtml: {
        html: inputBeforeHTML,
        classes: ""
    },
    afterHtml: {
        html: inputAfterHTML,
        classes: ""
    },
    labelHTML: inputLabel,
    input: {},
    container: {},
    attributes: {
        required: true
    },
    settings: {
        width: "1/2"
    },
    errors: {}
}

export default settings;