
function initVisual() {
  $("#show_instructions_link").click(toggleFunctionGenerator("instructions_modal"));
  $("#show_instructions_link2").click(toggleFunctionGenerator("instructions_modal"));
  $("#close_instructions_link").click(toggleFunctionGenerator("instructions_modal"));
  $("#jugar_btn").click(toggleFunctionGenerator("intro_modal"));
  $("#day_btn").click(toggleFunctionGenerator("day_modal"));

  $(".stats__of1000").each((k, v) => v.innerText = "/" + Game.p_total);
  $(".stats__days .stats__of1000").each((k, v) => v.innerText = "/" + Game.d_total);
  $("#mobility_input").on('input', (evt) => $("#mobility").text(Math.round($("#mobility_input").val() * 100)));
  $("#meetings_input").on('input', (evt) => $("#meetings").text($("#meetings_input").val()));
  $("#mobility_input").val(Game.init_mobility);
  $("#meetings_input").val(Game.init_meetings);
  $("#mobility").text(Math.round($("#mobility_input").val() * 100));
  $("#meetings").text($("#meetings_input").val());

  $("#ph__meeting_no").text(Game.t_meetings);
  $("#ph__total_ppl").text(Game.p_total);
  $("#ph__total_ws").text(Game.w_total);
  $("#ph__init_sick").text(Game.init_sick.length);
  $("#ph__meeting_happiness").text(Game.meeting_happiness);
  $("#ph__work_happiness").text(Game.work_happiness);
  $("#ph__w_contagion").text(Game.w_contagion);
  $("#ph__m_contagion").text(Game.m_contagion);
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
