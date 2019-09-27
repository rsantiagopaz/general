/* ************************************************************************

   Copyright:
     2008 openWorks

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martín Alejandro Paz

************************************************************************ */

/**
* Objeto creado con un {@link qx.ui.basic.Label} y un {@link  qx.ui.form.DateField}.<br />
* Ademas, hace uso de la clase {@link qx.ui.form.ow.Validator} para chequear que la fecha sea ingresada correctamente.
* 
* *Ejemplo:*
*
* <pre class='javascript'>
*  var txdDateText = new qx.ui.form.ow.DateText("Label:");
*  </pre>
*/

qx.Class.define("componente.general.alejandro.ow.DateText",
{
	extend : qx.ui.container.Composite,
	/**
	* @param label {String} Titulo que acompaña al DateField.
	* @param require {Boolean ? false} _true_ si se quiere controlar que no sea vacio.
	*/
	construct : function (label, require)
	{
		this.base(arguments);

		this.setLayout(new qx.ui.layout.HBox(1));

		this._label = new qx.ui.basic.Label(label);
		this._label.setWidth(120);
		this._label.setRich(true);

		this._dateText = new qx.ui.form.DateField();
		this._dateText.setValue(new Date());
		this._dateText.setDateFormat(new qx.util.format.DateFormat("dd/MM/yyyy"));
		this._dateText.setWidth(200);

		this._validator = new componente.general.alejandro.ow.Validator('date', require);
		this._colorInvalid = "red";

		this.add(this._label);
		this.add(this._dateText);
	},
	members :
	{
		_label : null,
		_dateText : null,
		_popup : null,
		_validator : null,
		_colorInvalid : null,
		/**
		* Activa el popup de warning en caso de que el valor ingresado no sea una fecha.
		* @return {void}
		*/
		_paintInvalid : function ()
		{
			if (!(this.isValid()))
			{
				this._dateText.setDecorator("main");
				this._dateText.setBackgroundColor(this._colorInvalid);
				if (this._popup != null)
				{
					if (this._popup.isHidden())
					{
						this._popup.show();
						qx.event.Timer.once(function()
						{
							if (!this._popup.isHidden())
							{
								this._popup.hide();
							}
						},this, 1500);
					}
				}
			}
			else
			{
				this._dateText.setDecorator("input");
				if (this._popup != null)
				{
					if (!this._popup.isHidden())
					{
						this._popup.hide();
					}
				}
			}
		},
		/**
		* Activa el chequeo en linea de la fecha ingresada.
		* @param color {String} cadena *hexadecimal* con el codigo del color o colores basicos en ingles que coloreara el objeto al ingresar una cadena invalida.
		* @return {void}
		*/
		checkInput : function (color)
		{
			if (color != undefined)
			{
				this._colorInvalid = color;
			}
			this._dateText.addListener("focusout", this._paintInvalid, this);
			this._dateText.addListener("focusin", function ()
			{
				this._dateText.setBackgroundColor("white");
				this._dateText.setDecorator("input-focused");
				if (this._popup != null)
				{
					this._popup.hide();
				}
			}, this);
		},
		
		/**
		* Devuelve el objeto *qx.ui.basic.Label*.
		* @return {qx.ui.basic.Label}
		*/
		getLabel : function () { return this._label; },
		
		/**
		* Devuelve el objeto *qx.ui.form.DateText*.
		* @return {qx.ui.form.DateText}
		*/
		getDateText : function () { return this._dateText; },
		
		/**
		* Devuelve el valor ingresado.
		* @return {String}
		*/
		getValue : function () { return this._dateText.getDateFormat().format(this._dateText.getValue()); },// return this._dateText.getValue(); },		
		
		/**
		* Devuelve el valor ingresado formateado para SQL.
		* @return {String}
		*/
		getValueToSQL : function () {
			var dateQx = this._dateText.getDateFormat().format(this._dateText.getValue()); 
			var dateSQL = "";
			if (dateQx)
				var dateSQL = dateQx.substr(6,4) + '-' + dateQx.substr(3,2) + '-' + dateQx.substr(0,2);
			return dateSQL;
		},
		
		/**
		* Devuelve el valor *true* en caso de ser una fecha valida.
		* @return {Boolean}
		*/
		isValid : function () { return this._validator.isValid(this._dateText.getValue()); },
		
		/**
		* Activa el chequeo en linea de la fecha ingresada.
		* @param date {Date} valor que sera ingresado al campo DateText.
		* @return {void}
		*/
		
		setValue : function (date) 
		{
			if (date)
				this._dateText.setValue(this._dateText.getDateFormat().parse(date)); 
			else
				this._dateText.setValue(new Date());
		},
		/**
		* Activa el chequeo en linea de la fecha ingresada.
		* @param text {String} valor del mensaje que sera mostrado cuando se ingrese incorrectamente una fecha.
		* @param icon {String} ubicacion del icono que acompañara al mensaje.
		* @return {void}
		*/
		
		setVisibleWarning : function (text, icon)
		{
			this._popup = new qx.ui.popup.Popup(new qx.ui.layout.Canvas()).set(
			{
				backgroundColor: "#F8FF77",
				padding: [2, 4],
				offset : 3,
				position : "top-right"
			});
			this._popup.setAutoHide(false);
			if ((text != null) && (text != ''))
			{
				this._popup.add(new qx.ui.basic.Atom(text, icon));
			}
			else
			{
				this._popup.add(new qx.ui.basic.Atom("El dato ingresado no es valido!", icon));
			}
			this.add(this._popup);
		},
		focus : function ()
		{
			this._text.focus();
		}
	}
});
