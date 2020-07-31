
function initVisual() {
  $("#show_instructions_link").click(toggleFunctionGenerator("instructions_modal"));
  $("#show_instructions_link2").click(toggleFunctionGenerator("instructions_modal"));
  $("#close_instructions_link").click(toggleFunctionGenerator("instructions_modal"));
  $("#jugar_btn").click(toggleFunctionGenerator("intro_modal"));
  $("#day_btn").click(toggleFunctionGenerator("day_modal"));

  for (var i = 0; i < 3; i++) {
    var text = $("#instructions_text").html();
    text = text + text;
    $("#instructions_text").html(text);
  }

  $(".stats__of1000").each((k, v) => v.innerText = "/" + Game.p_total);
  $(".stats__days .stats__of1000").each((k, v) => v.innerText = "/" + Game.d_total);
  $("#mobility_input").on('input', (evt) => $("#mobility").text($("#mobility_input").val()));
  $("#meetings_input").on('input', (evt) => $("#meetings").text($("#meetings_input").val()));
  $("#mobility_input").val(Game.init_mobility);
  $("#meetings_input").val(Game.init_meetings);
  $("#mobility").text($("#mobility_input").val())
  $("#meetings").text($("#meetings_input").val())
}

function toggleFunctionGenerator(id) {
  return function() {
    document.querySelector("#" + id).classList.toggle("modal--is-hidden");
    return false;
  }
}

function rootColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

InfectedColors = {} 
InfectedColors[InfectedState.HEALTHY] = rootColor('--healthy');
InfectedColors[InfectedState.ASYMPTOMATIC] = rootColor('--asymptomatic');
InfectedColors[InfectedState.PRESYMPTOMATIC] = rootColor('--presymptomatic');
InfectedColors[InfectedState.SYMPTOMATIC] = rootColor('--symptomatic');
InfectedColors[InfectedState.RECOVERED] = rootColor('--recovered');
InfectedColors[InfectedState.DEAD] = rootColor('--dead');
