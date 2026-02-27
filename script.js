import { getChampions, getRoles , getChampion } from "./service.js";



console.log("entera",getChampions())
console.log("filtrada",getChampions("Marksman"))
console.log("champ",getChampion("Akshan"))
console.log("entera",getRoles())
console.log("filtrada",getRoles("Akshan"))


var champions = await getChampions();
var roles = await getRoles();

let championsVsName = {
                        'rol1':{
                            'nameRol':'',
                            'champions': [],
                            'champion': {
                                'name': '',
                                'values':{}
                            }

                        },
                        'rol2':{
                            'nameRol':'',
                            'champions': [],
                            'champion': {
                                'name': '',
                                'values':{}
                            }
                        }
                        };

function renderSelectRol(id){
    const select = document.getElementById(id)

    select.innerHTML = `<option value="" selected disabled hidden>Selecciona un rol</option>
                        ${roles.map(rol => `<option value="${rol}">${rol}</option>`)}`
    select.onchange = async () => await setValueRol(id);
}

async function setValueRol(id){
    const select = document.getElementById(id)

    const rol = championsVsName[id]
    rol.nameRol = select.value

    rol.champions = await getChampions(rol.nameRol)
    if(id === "rol1") {
        renderSelectChampion("cham1", "rol1")
    }else{
        renderSelectChampion("cham2", "rol2")
    }
}

function renderSelectChampion(id, rol){
    const select = document.getElementById(id)
    const listCham = championsVsName[rol]?.champions ;
    select.innerHTML = `<option value="" selected disabled hidden>Selecciona un champ</option>
    ${listCham.map(champ => `<option value="${champ.id}">${champ.id}</option>`)}`

    
    select.onchange = async () => await setValueChampion(id, rol);
}

async function setValueChampion(id, ro){
    const select = document.getElementById(id)

    const rol = championsVsName[ro]
    rol.champion.name = select.value

    rol.champion.values = await getChampion(rol.champion.name)
    renderCard(id, ro)
}

function renderCard(id, rolKey) {
    const container = document.getElementById(id + rolKey);
    console.log(id + rolKey)
    if (!container) return;
    console.log("aquì1")
    const championData = championsVsName[rolKey].champion.values;
    const data = Object.values(championData)[0];

    if (!data) return;

    container.innerHTML = `
        <div class="card">
            <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${data.id}_0.jpg" 
                 alt="${data.name}" style="width:100%; border-radius: 8px;">
            
            <h2>${data.name}</h2>
            <p><i>${data.title}</i></p>
            
            <div class="stats">
                <p>❤️ <b>Vida:</b> ${data.stats.hp}</p>
                <p>🛡️ <b>Armadura:</b> ${data.stats.armor}</p>
                <p>🌀 <b>Dificultad:</b> ${data.info.difficulty}/10</p>
            </div>

            <div class="lore">
                <p>${data.blurb}</p>
            </div>

            <div class="tags">
                ${data.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
            </div>
        </div>
    `;
}


renderSelectRol("rol1")
renderSelectRol("rol2")
renderSelectChampion("cham1", "rol1")
renderSelectChampion("cham2", "rol2")