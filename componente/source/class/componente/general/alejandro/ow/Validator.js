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
* COMPLETAR.
* 
* *Ejemplo:*
*
* <pre class='javascript'>
*  var datosEstructura = 
*  [
*   {value: '1' , label: 'nombre del item1', selected: true},  
*   {label: 'nombre del item 2', value: '2'},
*   {label: 'nombre del item 4'},
*   {value: '5', selected: true}
*  ]
*   var swEjemplo = new qx.ui.form.ow.ListSwitch("List No Selec.","List Seleccionados", datosEstructura)
*  </pre>
*/
qx.Class.define("componente.general.alejandro.ow.Validator",
{
	extend : qx.core.Object,
	construct : function (type, require)
	{
		this.base(arguments);

		this.setType(type, require);
	},
	members :
	{
		_RegExp : null,
		getRegExp : function () { return this._RegExp },
		setType : function (type, require)
		{
			switch (type)
			{
				case 'integer':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^((\d)+){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^((\d)+){0,1}$/);
					}
					break;
				}
				case 'decimal':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^((?:\+|-)?\d+\.{0,1}(\d)*){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^((?:\+|-)?\d+\.{0,1}(\d)*){0,1}$/);
					}
					break;
				}
				case 'email':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^(([0-9a-zA-Z]+(?:[._][0-9a-zA-Z])*)+@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^(([0-9a-zA-Z]+(?:[._][0-9a-zA-Z])*)+@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})){0,1}$/);
					}
					break;
				}
				case 'hora':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^((0[0-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^((0[0-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)){0,1}$/);
					}
					break;
				}
				case 'usuario':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^([a-zA-Z0-9_]{3,50}){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^([a-zA-Z0-9_]{3,50}){0,1}$/);
					}
					break;
				}
				case 'password':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^([.a-zA-Z0-9_-]{5,30}){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^([.a-zA-Z0-9_-]{5,30}){0,1}$/);
					}
					break;
				}
				case 'url':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^((ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^((ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?){0,1}$/);
					}
					break;
				}
				case 'alfa':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^((\w|\s){3,50}){1}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^((\w|\s){3,50}){0,1}$/);
					}
					break;
				}
				case 'date':
				{
					if (require)
					{
						this._RegExp = new RegExp(/^(0[1-9]|1\d|2\d|3[1-2])\/(0[1-9]|1[0-2])\/\d{4}$/);
					}
					else
					{
						this._RegExp = new RegExp(/^((0[1-9]|1\d|2\d|3[1-2])\/(0[1-9]|1[0-2])\/\d{4}){0,1}$/);
					}
					break;
				}
				default :
				{
					if ((type != null) && (type != ''))
					{
						this.debug("El TIPO ingresado NO EXISTE!");
						this._RegExp = new RegExp();
					}
					else
					{
						if (require)
						{
							this._RegExp = new RegExp(/^((\w|\s|\W){3,150}){1}$/);
						}
						else
						{
							this._RegExp = new RegExp(/^((\w|\s\W){3,150}){0,1}$/);
						}
					}
					break;
				}
			}
		},
		isValid : function (value)
		{
			if (value != null)
			{
				value = value.replace(/[ñáéíóúÁÉÍÓÚ]/gi, ' ');
			}
			else
			{
				value = "";
			}
			
			return this._RegExp.test(value);
		}
	}
});
