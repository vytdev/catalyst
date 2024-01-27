import { UIContext } from "../core/forms.js";
import { FormCancelationReason } from "@minecraft/server-ui";

// TODO: support rawtext
/**
 * text type
 */
export type text = string /* | RawText */;

/**
 * message form button
 */
export interface button {
	/**
	 * label for the button
	 */
	text: text,

	/**
	 * function to be called if a player selected this button
	 */
	action: (ctx: UIContext) => void,
}

/**
 * action form button
 */
export interface actionBtn extends button {
	/**
	 * optional icon path for the button icon
	 */
	icon?: string,
}

/**
 * base modal input structure
 */
export interface baseInput {
	/**
	 * identifier for the input, which can later be accessed by the submit
	 * function
	 */
	id: string,

	/**
	 * type of the input
	 */
	type: string,

	/**
	 * label text for the input
	 */
	label: text,

	/**
	 * default value
	 */
	default?: any,
}

/**
 * dropdown input
 */
export interface dropdownInput extends baseInput {
	/**
	 * type of the input
	 */
	type: "dropdown",

	/**
	 * an array of text as the input options
	 */
	options: text[],

	/**
	 * default index of selection on dropdown
	 */
	default?: number,
}

/**
 * slider input
 */
export interface sliderInput extends baseInput {
	/**
	 * type of input
	 */
	type: "slider",

	/**
	 * minimum slider range
	 */
	min: number,
	/**
	 * maximum slider range
	 */
	max: number,

	/**
	 * slider step count
	 */
	step?: number,

	/**
	 * default slider value
	 */
	default?: number,
}

/**
 * text input
 */
export interface textInput extends baseInput {
	/**
	 * type of input
	 */
	type: "text",

	/**
	 * placeholder text for the text field
	 */
	placeholder?: text,

	/**
	 * default assigned text
	 */
	default?: text,
}

/**
 * toggle input
 */
export interface toggleInput extends baseInput {
	/**
	 * type of input
	 */
	type: "toggle",

	/**
	 * default value of input
	 */
	default?: boolean,
}

/**
 * base form
 */
export interface baseForm {
	/**
	 * title for the form
	 */
	title: text,

	/**
	 * form cancelation handler callback
	 */
	cancel?: (ctx: UIContext, reason: FormCancelationReason) => void,
}

/**
 * action form
 */
export interface actionForm extends baseForm {
	/**
	 * body text
	 */
	body?: text,

	/**
	 * action buttons
	 */
	buttons: actionBtn[],
}

/**
 * message form
 */
export interface messageForm extends baseForm {
	/**
	 * message to show
	 */
	message: text,

	/**
	 * first button
	 */
	btn1: button,

	/**
	 * second button
	 */
	btn2: button,
}

/**
 * mod form
 */
export interface modalForm extends baseForm {
	/**
	 * array of modal input field data
	 */
	inputs: (dropdownInput | sliderInput | textInput | toggleInput)[],

	/**
	 * function to execute when this modal form is submitted
	 */
	submit: (ctx: UIContext, result: modalResponse) => void,
}

/**
 * modal form response
 */
export type modalResponse = Record<string, number | string | boolean>;

/**
 * form types
 */
export type formType = actionForm | messageForm | modalForm;
