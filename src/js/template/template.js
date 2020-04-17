/**
 * Ultra light template
 * @author Loris Pinna
 *
 * Create a <script type="text/html"> element with attribute data-template which is template_el variable
 * Custom variables are {key} (using moustaches)
 * It's iterate in objects
 */
class Template {
    constructor(template_el) {
        this.template_el = template_el;
    }

    /**
     * Create html string from template
     * @param data
     * @return string
     */
    render(data) {
        this.template = document.querySelector(this.template_el).innerText;
        return  this.recursiveReplace(this.template, "", data);
    }

    /**
     * Append new rendered template in element
     * @param {HTMLElement|string} in_element
     * @param data
     */
    append(in_element, data) {
        let d = this.render(data);

        if(typeof in_element === "string")
            document.querySelector(in_element).insertAdjacentHTML('beforeend', d);
        else
            in_element.insertAdjacentHTML('beforeend', d);
    }

    /**
     * Prepend new rendered template in element
     * @param {HTMLElement|string} in_element
     * @param data
     */
    prepend(in_element, data) {
        let d = this.render(data);

        if(typeof in_element === "string")
            document.querySelector(in_element).insertAdjacentHTML('afterbegin', d);
        else
            in_element.insertAdjacentHTML('afterbegin', d);
    }

    /**
     * Recursive replace
     * @param {string} template
     * @param {string} parent_path
     * @param data
     * @return {*}
     */
    recursiveReplace(template, parent_path, data) {
        Object.entries(data).forEach((value, key) => {
            //check if array or object, and call recursive replace again
            if(Array.isArray(value[1]) || typeof value[1] === "object") {
                template = this.recursiveReplace(template, `${parent_path + value[0]}.`, value[1]);
            }
            else {
                //hourray ! value[1] is a string to we can replace string
                template = this.replace(template, `${parent_path + value[0]}`, value[1]);
            }
        });
        return template;
    }

    /**
     * Replace key with string in template
     * @param template
     * @param key
     * @param value
     * @return {void | string}
     */
    replace(template, key, value) {
        let re = new RegExp('{' + key + '}', 'g');
        return template.replace(re, value);
    }
}

export default Template;