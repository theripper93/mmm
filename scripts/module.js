Hooks.on("midi-qol.RollComplete", (workflow) =>{

const applyOnCritSave = true
const applyOnCrit = true
const applyOnDamage = true
const applyOnDown = true

for(let target of workflow.damageList){
    const actor = game.actors.get(target.actorId)
    const hpMax = actor.data.data.attributes.hp.max
    const damageTaken = target.hpDamage
    const isHalfOrMore = damageTaken >= hpMax/2
    const damageType = workflow.damageDetail[0].type
    const save = workflow.saveDisplayData?.find(s => s.id === target.tokenId)
    const isCritSave = save?.rollDetail?.terms[0]?.number === 1
    const isCrit = workflow.isCritical;
    const isDead = target.newHP <= 0
    if(isHalfOrMore && applyOnDamage){
        MaxwelMaliciousMaladies.confirmInjury("Damage exeded half of maximum hp", damageType, actor)
        continue;
    }
    if(isCritSave && applyOnCritSave){
        MaxwelMaliciousMaladies.confirmInjury("Fumbled saving throw", damageType, actor)
        continue;
    }
    if(isCrit && applyOnCrit){
        MaxwelMaliciousMaladies.confirmInjury("Critical hit", damageType, actor)
        continue;
    }
    if(isDead && applyOnDown){
        MaxwelMaliciousMaladies.confirmInjury("Downed", damageType, actor)
        continue;
    }

}



});