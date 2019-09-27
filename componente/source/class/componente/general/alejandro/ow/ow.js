qx.Class.define("componente.general.alejandro.ow.ow", {
	statics : {
		addInteresLista : function (num, interes) {
			var x = - (10000*num) / (interes*interes - 10000);
			x = x + x * interes / 100;
			return x;
		},
		delInteresLista : function (num, interes) {
			var x = num - (num * interes / 100);
			return x;
		},
		FixDecimal : function (value) {
			if (isNaN(value))
				value = 0;
			value=Math.round(value*100)/100;
			value=value.toFixed(2);
			return value;
		},
		CheckCuit : function (cuit) {
			var multiplos = new Array(9);
			multiplos[0] = 5;
			multiplos[1] = 4;
			multiplos[2] = 3;
			multiplos[3] = 2;
			multiplos[4] = 7;
			multiplos[5] = 6;
			multiplos[6] = 5;
			multiplos[7] = 4;
			multiplos[8] = 3;
			multiplos[9] = 2;
			var sumador = 0;

			if (cuit.length == 11) {
				for(var i=0;i<((cuit.length)-1);i++) {
					sumador = sumador + (cuit.charAt(i) * multiplos[i]);
				}

				sumador = (11 - (sumador % 11)) % 11;

				if (cuit.charAt(10) != sumador) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},
		getListHTML : function (list, app, format, titulo) {
			var html = "<table " + format.table + " >\n<tr><td colspan='100'><input type='text' value='" + titulo + "' style='width: 100%;' /></td></tr>\n<tr style='font-size:12; font-weight: bold;' align='center'>\n";
			var length = list.getChildren().length;
			for (var i=0; i<length; i++) {
					html +="<tr>\n";
					html +="\t<td>" + list.getChildren()[i].getLabel() + "</td>\n";
					html +="</tr>\n";
			}
			html +="</table>";

			var winDemo = new qx.ui.window.Window("Impresion");
			winDemo.setLayout(new qx.ui.layout.Canvas());
			winDemo.setWidth(800);
			winDemo.setHeight(500);
			var frame = new qx.ui.embed.Iframe("");
			frame.addListener("load", function() {
				var doc = frame.getDocument();

//				doc.body.innerHTML = funciones.ow.getTableHTML(app._tblGral, app, {table:"border='1' cellspacing='0' cellpadding='0' width='100%'"});
				doc.body.innerHTML = html;

			}, app);
			var btn = new qx.ui.form.Button("Imprimir");
			btn.addListener("execute", function () {
				frame.getWindow().print();
			});
			winDemo.add(btn, {top:0, left:0});
			winDemo.add(frame, {top: 30, left:0, right:0, bottom:0});
			winDemo.center();
//			winDemo.open();
			return winDemo;
		},
		getTableHTML : function (table, app, format, titulo) {
			var tm = table.getTableModel();
			var tcm = table.getTableColumnModel();
			if (!titulo) {
				titulo = "";
			}

			var cols = new Array();
			for (var i=0; i<tm.getColumnCount(); i++) {
//				if (tcm.isColumnVisible(i)) {
					cols.push({id:i, nombre: tm.getColumnName(i), visible:tcm.isColumnVisible(i)});
//					app.debug(tm.getColumnName(i) + " - Col: " + i);
//				} else {
//					app.debug(tm.getColumnName(i) + " - Oculta Col: " + i);
//				}
			}

			var html = "<table " + format.table + " >\n<tr><td colspan='100'><input type='text' value='" + titulo + "' style='width: 100%;' /></td></tr>\n<tr style='font-size:12; font-weight: bold;' align='center'>\n";
			for (var td=0; td<cols.length; td++) {
				if (cols[td].visible) {
					html += "\t<td>" + cols[td].nombre + "</td>\n";
				}
			}
			html +="</tr>\n";

			var datos = tm.getData();
//			app.debug(datos.length-1);
			for (var tr=0; tr<(datos.length); tr++) {
				html +="<tr>\n";
				for (var td=0; td<(cols.length); td++) {
					if (cols[td].visible) {
						if (isNaN(datos[tr][td])) {
							if (datos[tr][td]) {
								html +="\t<td>" + datos[tr][td] + "</td>\n";
							} else {
								html +="\t<td>&nbsp;</td>\n";
							}
						} else {
							html +="\t<td>" + componente.general.alejandro.ow.ow.FixDecimal(datos[tr][td]) + "</td>\n";
						}
					}
				}
				html +="</tr>\n";
			}
			html +="</table>";

			var winDemo = new qx.ui.window.Window("Impresion");
			winDemo.setLayout(new qx.ui.layout.Canvas());
			winDemo.setWidth(800);
			winDemo.setHeight(500);
			var frame = new qx.ui.embed.Iframe("");
			frame.addListener("load", function() {
				var doc = frame.getDocument();

//				doc.body.innerHTML = funciones.ow.getTableHTML(app._tblGral, app, {table:"border='1' cellspacing='0' cellpadding='0' width='100%'"});
				doc.body.innerHTML = html;

			}, app);
			var btn = new qx.ui.form.Button("Imprimir");
			btn.addListener("execute", function () {
				frame.getWindow().print();
			});
			winDemo.add(btn, {top:0, left:0});
			winDemo.add(frame, {top: 30, left:0, right:0, bottom:0});
			winDemo.center();
//			winDemo.open();
			return winDemo;
//			return html;
		}
	}
});
