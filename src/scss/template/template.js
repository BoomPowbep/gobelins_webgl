class Template {
    constructor(template_el) {
        this.template_el = template_el;
    }

    render(data) {
        this.template = document.querySelector(this.template_el).innerText;
        return  this.recursiveReplace(this.template, "", data);
    }

    append(in_element, data) {
        let d = this.render(data);

        if(typeof in_element === "string")
            document.querySelector(in_element).insertAdjacentHTML('beforeend', d);
        else
            in_element.insertAdjacentHTML('beforeend', d);
    }

    prepend(in_element, data) {
        let d = this.render(data);

        if(typeof in_element === "string")
            document.querySelector(in_element).insertAdjacentHTML('afterbegin', d);
        else
            in_element.insertAdjacentHTML('afterbegin', d);
    }

    recursiveReplace(template, parent_path, data) {
        Object.entries(data).forEach((value, key) => {
            if(Array.isArray(value[1]) || typeof value[1] === "object") {
                template = this.recursiveReplace(template, `${parent_path + value[0]}.`, value[1]);
            }
            else {
                template = this.replace(template, `${parent_path + value[0]}`, value[1]);
            }
        });
        return template;
    }

    replace(template, key, value) {
        let re = new RegExp('{' + key + '}', 'g');
        return template.replace(re, value);
    }
}

export default Template;