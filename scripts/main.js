class MaxwelMaliciousMaladies {
  static async rollTable(name){
    name = name.trim();
    if(!name.endsWith("[MMMM]")) name = name + " - [MMMM]";
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const table = game.tables.getName(name) ?? await this.getTableFromPack(name);
    if(!table) return await this.displayDialog();
    const result = await table.draw()
    this.rollSubtable(result.results[0].text);
  }

  static rollSubtable(result){
    const subTables = ["Scar Chart", "Small Appendage", "Large Limb"];
    for(let tab of subTables){
      if(result.toLowerCase().includes(tab.toLowerCase())){
        MaxwelMaliciousMaladies.rollTable(tab);
        return;
      }
    }
  }


  static getPack(){
    return game.packs.get("mmm.mmmm");
  }

  static async getTableFromPack(name){
    const pack = this.getPack();
    const entry = Array.from(pack.index).find(e => e.name == name);
    return await pack.getDocument(entry._id);
  }

  static async displayDialog(){
    let select = `<div class="form-group"><select style="width: 100%;" id="mmm-select-table">`;
    const pack = this.getPack();
    const tableNames = Array.from(pack.index).map(e => e.name.replace(" - [MMMM]", ""));
    tableNames.forEach(name => select+=`<option value="${name}">${name}</option>`);
    select += `</select></div><p>`;
    new Dialog({
      title: "Maxwell's Manual of Malicious Maladies",
      content: `<p>Chose a Table:</p>${select}`,
      buttons: {
       one: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Roll Injury",
        callback: (html) => {
          const tableName = html.find("#mmm-select-table")[0].value;
          MaxwelMaliciousMaladies.rollTable(tableName);
        }
       },
       two: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
        callback: () => {}
       }
      },
      default: "two",
     }).render(true);

  }

  static async confirmInjury(reason, tablename){
    new Dialog({
      title: "Maxwell's Manual of Malicious Maladies",
      content: `<p>You sustained a lingering injury because <strong>${reason}</strong>. Roll on the ${tablename} table?</p>`,
      buttons: {
       one: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Roll Injury",
        callback: (html) => {
          MaxwelMaliciousMaladies.rollTable(tablename);
        }
       },
       two: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
        callback: () => {}
       }
      },
      default: "two",
     }).render(true);
  }
}
