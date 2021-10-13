Hooks.once('init', async function() {

});

Hooks.once('ready', async function() {

});

Hooks.on("chatMessage", (ChatLog, content) => {
    if (content.toLowerCase().startsWith("/mmmm")) {
      const data = content.replace("/mmmm", "").trim();
      MaxwelMaliciousMaladies.rollTable(data);
      return false;
    }
  });

Hooks.on("renderChatMessage", (message, html)=>{
    if(!game.user.isGM || !message?.data?.flavor?.includes("[MMMM]")) return;
    const button = $(`<a title="Apply Lingering Injury" styles="margin-right: 0.3rem;" class="button"><i class="fas fa-viruses"></i></a>`)
    html.find(".message-delete").before(button);
    button.on("click", (e)=>{
        e.preventDefault();
        const actor = _token?.actor;
        if(!actor) return ui.notifications.error("No token selected!");
        const content = $(message.data.content)
        const imgsrc = content.find("img").attr("src");
        const description = content.find(".result-text").html();
        const title = content.find("strong").first().text();
        const itemData = {
            name: title,
            img: imgsrc,
            type: "feat",
            "data.description.value": description,
        }
        actor.createEmbeddedDocuments("Item", [itemData]);
        ui.notifications.notify(`Added ${title} lingering injury to ${actor.data.name}`)
    });
});