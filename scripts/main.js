class MaxwelMaliciousMaladies {
  static async rollTable(name){
    name = name.trim();
    if(!name.endsWith("[MMMM]")) name = name + " - [MMMM]";
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const table = game.tables.getName(name) ?? await this.getTableFromPack(name);
    return await table.draw()
  }

  static getPack(){
    return game.packs.get("mmm.mmmm");
  }

  static async getTableFromPack(name){
    const pack = this.getPack();
    const entry = Array.from(pack.index).find(e => e.name == name);
    return await pack.getDocument(entry._id);
  }
}
