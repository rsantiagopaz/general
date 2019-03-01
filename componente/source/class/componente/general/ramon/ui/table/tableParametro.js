qx.Class.define("componente.general.ramon.ui.table.tableParametro",
{
	extend : componente.general.ramon.ui.table.Table,
	construct : function (tableModel, tabla, win)
	{

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	this.base(arguments, tableModel, custom);
	
	
	win.addListener("aceptado", function(e){
		var data = e.getData();
		
		functionActualizar(data);
	});
		

	var tbl = this;
	var numberformatMontoEs2 = new qx.util.format.NumberFormat("es").set({groupingUsed: true});
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	
	var functionActualizar = qx.lang.Function.bind(function(id) {
		var p = {};
		p.tabla = tabla;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametro");
		rpc.addListener("completed", function(e){
			var data = e.getData();

			tableModel.setDataAsMapArray(data.result, true);
			
			if (id == null) {
				if (data.result.length > 0) this.setFocusedCell(0, 0, true);
			} else {
				this.blur();
				this.buscar("id_" + tabla, id);
				this.focus();				
			}
		}, this);
		
		rpc.callAsyncListeners(true, "leer_parametro", p);
	}, this);
	
	
	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		if (win == null) {
			var row = qx.lang.Json.parse('{"id_' + tabla + '": "0", "descrip": ""}');
			
			tableModel.addRowsAsMapArray([row], null, true);
			this.setFocusedCell(0, tableModel.getRowCount() - 1, true);
			this.startEditing();
		} else {
			
			win.center();
			win.open();
		}
	}, this);
	
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		if (win == null) {
			this.startEditing();
		} else {
			var rowData = tableModel.getRowData(this.getFocusedRow());
			
			var p = {};
			p.tabla = tabla;
			p["id_" + tabla] = rowData["id_" + tabla];
			
			var rpc = new componente.general.ramon.io.rpc.Rpc("services/", "comp.Parametro");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				win.center();
				win.open(data.result[0]);
			}, this);
			
			rpc.callAsyncListeners(true, "leer_parametro", p);
			
		}
	}, this);
	
	
	var menu = new componente.general.ramon.ui.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar...", null, commandAgregar);
	var btnEditar = new qx.ui.menu.Button("Editar", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnEditar);
	menu.memorizar();
	commandAgregar.setEnabled(false);
	
	
	
	this.setShowCellFocusIndicator(win == null);
	this.toggleColumnVisibilityButtonVisible();
	//tbl.toggleStatusBarVisible();
	this.setContextMenu(menu);
	
	this.addListener("cellDbltap", function(e){
		if (win != null) commandEditar.execute();
	});
	
	var tableColumnModel = this.getTableColumnModel();
	
	var selectionModel = this.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(){
		var selectionEmpty = selectionModel.isSelectionEmpty();

		commandEditar.setEnabled(! selectionEmpty);
		menu.memorizar([commandEditar]);
		sharedErrorTooltip.hide();
	}, this);
	
	
	this.addListener("dataEdited", function(e){
		var data = e.getData();
		data.value = data.value.trim();

		var rowData = tableModel.getRowDataAsMap(data.row);
		rowData.descrip = data.value;
		
		if (data.value == "") {
			if (rowData["id_" + tabla] == "0") {
				qx.event.Timer.once(function(){
					if (this.getFocusedRow() == data.row) {
						this.startEditing();
						
						qx.event.Timer.once(function(){
							sharedErrorTooltip.setLabel("Debe ingresar descripción");
							sharedErrorTooltip.placeToWidget(this);
							sharedErrorTooltip.show();					
						}, this, 100);
					} else {
						tableModel.removeRows(data.row, 1);
					}
				}, this, 100);
			} else {
				rowData.descrip = data.oldValue;
				tableModel.setRowsAsMapArray([rowData], data.row, true);
			}

		} else if (data.value != data.oldValue) {
			var p = {};
			p.tabla = tabla;
			p.model = rowData;
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametro");
			
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				functionActualizar(data.result);
			}, this);
			
			rpc.addListener("failed", function(e){
				var error = e.getData();
				
				if (error.message = "duplicado") {
					rowData.descrip = data.oldValue;
					tableModel.setRowsAsMapArray([rowData], data.row, true);
					
					if (rowData["id_" + tabla] == "0") {
						qx.event.Timer.once(function(){
							if (this.getFocusedRow() == data.row) {
								this.startEditing();
							} else {
								tableModel.removeRows(data.row, 1);
							}
							
							qx.event.Timer.once(function(){
								sharedErrorTooltip.setLabel("Descripción duplicada");
								sharedErrorTooltip.placeToWidget(this);
								sharedErrorTooltip.show();					
							}, this, 50);
						}, this, 50);
					} else {
						sharedErrorTooltip.setLabel("Descripción duplicada");
						sharedErrorTooltip.placeToWidget(this);
						sharedErrorTooltip.show();
					}
				}
			}, this);
			
			rpc.callAsyncListeners(true, "editar_parametro", p);
		} else if (data.value == data.oldValue) {
			tableModel.setValueById("descrip", data.row, data.oldValue);
		}
	}, this);
	
	
	this.addListener("dataCanceled", function(e){
		var focusedRow = this.getFocusedRow();
		var rowData = tableModel.getRowData(focusedRow);
		
		if (rowData["id_" + tabla] == "0") {
			if (tableModel.getRowCount() - 2 >= 0) this.setFocusedCell(0, focusedRow - 1, true);
			tableModel.removeRows(focusedRow, 1);
		}
	}, this);
	
	
	
	tableModel.addListener("dataChanged", function(e){
		var rowCount = tableModel.getRowCount();
		this.setAdditionalStatusBarText(numberformatMontoEs2.format(rowCount) + ((rowCount == 1) ? " item" : " items"));
	}, this);
	
	
	
	functionActualizar();
	
	
	},

	members :
	{

	}
});