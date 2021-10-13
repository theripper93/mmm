Hooks.once('init', function() {
  const applyOnCritSave = true;
  const applyOnCrit = true;
  const applyOnDamage = true;
  const applyOnDown = true;
  game.settings.register("mmm", "applyOnCritSave", {
    name: "On fumbled Saving Throw",
    hint: "Prompt for a lingering injury roll on a fumbled saving throw.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("mmm", "applyOnCrit", {
    name: "On Critical",
    hint: "Prompt for a lingering injury roll on a critical hit.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("mmm", "applyOnDamage", {
    name: "On Damage",
    hint: "Prompt for a lingering injury roll when the damage recived is more than half of the max hp.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("mmm", "applyOnDown", {
    name: "On Unconscious",
    hint: "Prompt for a lingering injury roll when damage brings an actor to 0 hp.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

});

Hooks.once('ready', async function() {

});

Hooks.on("chatMessage", (ChatLog, content) => {
    if (content.toLowerCase().startsWith("/mmmm")) {
      const data = content.replace("/mmmm", "").trim();
      if(data){
        MaxwelMaliciousMaladies.rollTable(data);
      }else{
        MaxwelMaliciousMaladies.displayDialog();
      }

      return false;
    }
  });

Hooks.on("renderChatMessage", (message, html)=>{
    if(!game.user.isGM || !message?.data?.flavor?.includes("[MMMM]")) return;
    const subTables = ["Scar Chart", "Small Appendage Table", "Large Limb Table"];
    for(let t of subTables){
      if(message?.data?.flavor?.includes(t)) return;
    }
    const button = $(`<a title="Apply Lingering Injury" style="margin-right: 0.3rem;color: red;" class="button"><i class="fas fa-viruses"></i></a>`)
    //html.find(".message-delete").before(button);
    html.find(".result-text").prepend(button)
    button.on("click", (e)=>{
        e.preventDefault();
        const actor = game.actors.get(message.data?.speaker?.actor) ?? _token?.actor;
        if(!actor) return ui.notifications.error("No token selected or actor found!");
        const content = $(message.data.content)
        const imgsrc = content.find("img").attr("src");
        const description = content.find(".result-text").html();
        const title = "Lingering Injury - " + content.find("strong").first().text();
        const itemData = {
            name: title,
            img: imgsrc,
            type: "feat",
            "data.description.value": description,
        }
        actor.createEmbeddedDocuments("Item", [itemData]);
        ui.notifications.notify(`Added ${title} to ${actor.data.name}`)
    });
});

let MaxwelMaliciousMaladiesSocket;

Hooks.once("socketlib.ready", () => {
  MaxwelMaliciousMaladiesSocket = socketlib.registerModule("mmm");
  MaxwelMaliciousMaladiesSocket.register("requestRoll", MaxwelMaliciousMaladies.requestRoll);
});