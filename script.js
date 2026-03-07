import { getChampions, getRoles , getChampion } from "./service.js";


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

// Carga selecciones guardadas del localStorage
function cargarSelecciones(){
    const guardado = localStorage.getItem("ultimaSeleccion");
    if(guardado){
        return JSON.parse(guardado);
    }
    return null;
}

// Guarda selecciones actuales en localStorage
function guardarSelecciones(){
    const seleccion = {
        rol1: championsVsName.rol1.nameRol,
        cham1: championsVsName.rol1.champion.name,
        rol2: championsVsName.rol2.nameRol,
        cham2: championsVsName.rol2.champion.name
    };
    localStorage.setItem("ultimaSeleccion", JSON.stringify(seleccion));
}

// Guarda comparacion en historial
function guardarHistorial(nombre1, nombre2, ganador){
    let historial = JSON.parse(localStorage.getItem("historial") || "[]");
    historial.unshift({nombre1, nombre2, ganador, fecha: new Date().toLocaleString()});
    if(historial.length > 10) historial = historial.slice(0, 10);
    localStorage.setItem("historial", JSON.stringify(historial));
    renderHistorial();
}

// Renderiza el historial de comparaciones
function renderHistorial(){
    const container = document.getElementById("historial");
    const historial = JSON.parse(localStorage.getItem("historial") || "[]");
    if(historial.length === 0){
        container.innerHTML = `<p class="text-slate-400">No hay comparaciones aún</p>`;
        return;
    }
    container.innerHTML = historial.map(item => `
        <div class="card bg-base-100 shadow-sm border p-3 w-60">
            <p class="font-bold">${item.nombre1} vs ${item.nombre2}</p>
            <p class="text-sm text-slate-500">🏆 ${item.ganador}</p>
            <p class="text-xs text-slate-400">${item.fecha}</p>
        </div>
    `).join('');
}

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

    Swal.fire({title:'Cargando campeones...', allowOutsideClick:false, didOpen:()=> Swal.showLoading()})
    rol.champions = await getChampions(rol.nameRol)
    Swal.close()

    if(!rol.champions){
        Swal.fire({icon:'error', title:'Error', text:'No se pudieron cargar los campeones'})
        return;
    }

    if(id === "rol1") {
        renderSelectChampion("cham1", "rol1")
    }else{
        renderSelectChampion("cham2", "rol2")
    }
    verificarBotonComparar()
    guardarSelecciones()
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

    Swal.fire({title:'Cargando campeón...', allowOutsideClick:false, didOpen:()=> Swal.showLoading()})
    rol.champion.values = await getChampion(rol.champion.name)
    Swal.close()

    if(!rol.champion.values){
        Swal.fire({icon:'error', title:'Error', text:'No se pudo cargar el campeón'})
        return;
    }

    renderCard(id, ro)
    verificarBotonComparar()
    guardarSelecciones()
}

// Verifica si ambos campeones estan seleccionados
function verificarBotonComparar(){
    const btn = document.getElementById("btnComparar")
    const champ1 = championsVsName.rol1.champion.name
    const champ2 = championsVsName.rol2.champion.name
    btn.disabled = !(champ1 && champ2)
}

function renderCard(id, rolKey) {
    const container = document.getElementById(id + rolKey);
    if (!container) return;

    const championData = championsVsName[rolKey].champion.values;
    const data = Object.values(championData)[0];

    if (!data) return;

    container.innerHTML = `
        <div class="flex flex-col items-center gap-3">
            <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${data.id}_0.jpg" 
                 alt="${data.name}" class="w-full rounded-xl shadow-md">
            
            <h2 class="text-xl font-bold">${data.name}</h2>
            <p class="text-slate-400 italic text-sm">${data.title}</p>
            
            <div class="w-full flex flex-col gap-1 mt-2">
                <div class="flex justify-between text-sm"><span>❤️ Vida</span><span class="font-bold">${data.stats.hp}</span></div>
                <progress class="progress progress-error w-full" value="${data.stats.hp}" max="700"></progress>
                
                <div class="flex justify-between text-sm"><span>⚔️ Ataque</span><span class="font-bold">${data.stats.attackdamage}</span></div>
                <progress class="progress progress-warning w-full" value="${data.stats.attackdamage}" max="150"></progress>

                <div class="flex justify-between text-sm"><span>🛡️ Armadura</span><span class="font-bold">${data.stats.armor}</span></div>
                <progress class="progress progress-info w-full" value="${data.stats.armor}" max="60"></progress>

                <div class="flex justify-between text-sm"><span>✨ Res. Mágica</span><span class="font-bold">${data.stats.spellblock}</span></div>
                <progress class="progress progress-success w-full" value="${data.stats.spellblock}" max="60"></progress>

                <div class="flex justify-between text-sm"><span>💨 Velocidad</span><span class="font-bold">${data.stats.movespeed}</span></div>
                <progress class="progress progress-primary w-full" value="${data.stats.movespeed}" max="400"></progress>
            </div>

            <div class="w-full mt-2">
                <p class="text-xs text-slate-500">${data.blurb}</p>
            </div>

            <div class="flex flex-wrap gap-1 mt-1">
                ${data.tags.map(tag => `<span class="badge badge-outline badge-sm">${tag}</span>`).join('')}
            </div>
        </div>
    `;
}


// Compara los dos campeones seleccionados
function compararCampeones(){
    const data1 = Object.values(championsVsName.rol1.champion.values)[0];
    const data2 = Object.values(championsVsName.rol2.champion.values)[0];

    if(!data1 || !data2){
        Swal.fire({icon:'warning', title:'Selecciona ambos campeones'})
        return;
    }

    const stats = [
        {nombre: '❤️ Vida', key: 'hp'},
        {nombre: '⚔️ Ataque', key: 'attackdamage'},
        {nombre: '🛡️ Armadura', key: 'armor'},
        {nombre: '✨ Res. Mágica', key: 'spellblock'},
        {nombre: '💨 Velocidad', key: 'movespeed'},
        {nombre: '🎯 Rango', key: 'attackrange'}
    ];

    let puntos1 = 0;
    let puntos2 = 0;

    let comparacionHTML = stats.map(stat => {
        const val1 = data1.stats[stat.key];
        const val2 = data2.stats[stat.key];
        let clase1 = '';
        let clase2 = '';

        if(val1 > val2){ puntos1++; clase1 = 'text-green-600 font-bold'; clase2 = 'text-red-500'; }
        else if(val2 > val1){ puntos2++; clase2 = 'text-green-600 font-bold'; clase1 = 'text-red-500'; }
        else { clase1 = 'text-yellow-500'; clase2 = 'text-yellow-500'; }

        return `
            <tr>
                <td class="${clase1} text-right pr-4">${val1}</td>
                <td class="text-center font-bold text-slate-500">${stat.nombre}</td>
                <td class="${clase2} text-left pl-4">${val2}</td>
            </tr>
        `;
    }).join('');

    let ganador = '';
    if(puntos1 > puntos2) ganador = data1.name;
    else if(puntos2 > puntos1) ganador = data2.name;
    else ganador = 'Empate';

    const resultadoDiv = document.getElementById("resultadoComparacion");
    resultadoDiv.innerHTML = `
        <div class="card bg-base-100 shadow-xl border-2 border-blue-custom p-6">
            <h3 class="text-2xl font-bold text-center text-blue-custom mb-4">⚔️ Resultado</h3>
            <table class="table w-full">
                <thead>
                    <tr>
                        <th class="text-right text-blue-custom">${data1.name}</th>
                        <th class="text-center">Stat</th>
                        <th class="text-left text-blue-custom">${data2.name}</th>
                    </tr>
                </thead>
                <tbody>${comparacionHTML}</tbody>
            </table>
            <div class="text-center mt-4">
                <p class="text-lg">Puntuación: <b>${data1.name}</b> ${puntos1} - ${puntos2} <b>${data2.name}</b></p>
                <p class="text-2xl font-black text-blue-custom mt-2">🏆 ${ganador === 'Empate' ? '¡Empate!' : ganador + ' gana!'}</p>
            </div>
        </div>
    `;

    Swal.fire({
        icon: ganador === 'Empate' ? 'info' : 'success',
        title: ganador === 'Empate' ? '¡Empate!' : `🏆 ${ganador} gana!`,
        text: `${data1.name} ${puntos1} - ${puntos2} ${data2.name}`,
        confirmButtonColor: '#0070f3'
    })

    guardarHistorial(data1.name, data2.name, ganador);
}

// Precarga las selecciones guardadas en localStorage
async function precargarSelecciones(){
    const guardado = cargarSelecciones();
    if(!guardado) return;

    Swal.fire({title:'Cargando última selección...', allowOutsideClick:false, didOpen:()=> Swal.showLoading()})

    try {
        if(guardado.rol1){
            championsVsName.rol1.nameRol = guardado.rol1;
            championsVsName.rol1.champions = await getChampions(guardado.rol1);
            document.getElementById("rol1").value = guardado.rol1;
            renderSelectChampion("cham1", "rol1");

            if(guardado.cham1){
                championsVsName.rol1.champion.name = guardado.cham1;
                championsVsName.rol1.champion.values = await getChampion(guardado.cham1);
                document.getElementById("cham1").value = guardado.cham1;
                renderCard("cham1", "rol1");
            }
        }
        if(guardado.rol2){
            championsVsName.rol2.nameRol = guardado.rol2;
            championsVsName.rol2.champions = await getChampions(guardado.rol2);
            document.getElementById("rol2").value = guardado.rol2;
            renderSelectChampion("cham2", "rol2");

            if(guardado.cham2){
                championsVsName.rol2.champion.name = guardado.cham2;
                championsVsName.rol2.champion.values = await getChampion(guardado.cham2);
                document.getElementById("cham2").value = guardado.cham2;
                renderCard("cham2", "rol2");
            }
        }
        verificarBotonComparar();
    } catch(e) {}

    Swal.close();
}

// Boton comparar
document.getElementById("btnComparar").onclick = () => compararCampeones();

renderSelectRol("rol1")
renderSelectRol("rol2")
renderSelectChampion("cham1", "rol1")
renderSelectChampion("cham2", "rol2")
renderHistorial()

await precargarSelecciones()