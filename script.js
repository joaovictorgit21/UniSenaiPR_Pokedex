var currentId = null;
var totalPokemons = 1025;

function atualizarBotoes() {
  document.getElementById('btn-prev').disabled = (currentId === null || currentId <= 1);
  document.getElementById('btn-next').disabled = (currentId === null || currentId >= totalPokemons);
}

function clearScreen() {
  currentId = null;
  atualizarBotoes();
  document.getElementById('screen-content').innerHTML =
    '<div class="idle-message">▶ POKÉDEX v2.0<br><br>INSIRA O NOME<br>DO POKÉMON<div class="pixel-arrow">▼</div></div>';
  document.getElementById('putText').value = '';
}

function renderPokemon(data) {
  currentId = data.id;
  atualizarBotoes();
  var types = data.types.map(t => t.type.name.toUpperCase()).join(' / ');
  var abilities = data.abilities.map(a => a.ability.name.toUpperCase()).join(', ');
  var spriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' + data.id + '.gif';
  var spriteBack = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/' + data.id + '.gif';
  document.getElementById('screen-content').innerHTML =
    '<div class="poke-name">' + data.name.toUpperCase() + '</div>' +
    '<div class="poke-id">#' + String(data.id).padStart(3,'0') + '</div>' +
    '<div class="sprites-row">' +
      '<img class="poke-sprite" src="' + spriteUrl + '" onerror="this.src=\'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.id + '.png\'" alt="' + data.name + '">' +
      '<img class="poke-sprite" src="' + spriteBack + '" onerror="this.style.display=\'none\'" alt="' + data.name + ' back">' +
    '</div>' +
    '<div class="poke-info">TIPO: <span>' + types + '</span><br>HP: <span>' + data.stats[0].base_stat + '</span> &nbsp; ATK: <span>' + data.stats[1].base_stat + '</span><br>HABIL: <span>' + abilities.slice(0,22) + (abilities.length>22?'…':'') + '</span></div>';
  document.getElementById('screen').classList.add('screen-flash');
  setTimeout(() => document.getElementById('screen').classList.remove('screen-flash'), 300);
}

function buscarPorId(id) {
  var sc = document.getElementById('screen-content');
  sc.innerHTML = '<div class="loading-text">LOADING...</div><div class="loading-bar"><div class="loading-fill"></div></div>';
  fetch('https://pokeapi.co/api/v2/pokemon/' + id)
    .then(res => { if (!res.ok) throw new Error(); return res.json(); })
    .then(data => renderPokemon(data))
    .catch(() => {
      sc.innerHTML = '<div class="error-msg">X ERRO! X<br><br>NÃO ENCONTRADO<br><br><span style="font-size:5px;color:var(--gb-screen-mid)">TENTE NOVAMENTE</span></div>';
    });
}

function buscar() {
  var putText = document.getElementById('putText').value.toLowerCase().trim();
  if (!putText) return;
  document.getElementById('putText').value = '';
  buscarPorId(putText);
}

function prev() {
  if (currentId !== null && currentId > 1) buscarPorId(currentId - 1);
}

function next() {
  if (currentId !== null && currentId < totalPokemons) buscarPorId(currentId + 1);
}