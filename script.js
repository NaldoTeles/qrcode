document.getElementById('cursos').addEventListener('change', function() {
    var idCurso = this.value;

    if (idCurso) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../model/GetCursoDetails.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var diaSelect = document.getElementById('id_dia');
                var horarioSelect = document.getElementById('id_hr');
                var sedeSelect = document.getElementById('id_sede');
                var vagasInfo = document.getElementById('total_vagas');

                // Limpa as opções atuais
                diaSelect.innerHTML = '<option value="">Selecione o dia</option>';
                horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
                sedeSelect.innerHTML = '<option value="">Selecione a sede</option>';

                if (response.length > 0) {
                    var vagasDisponiveis = response[0].total_vagas;

                    // Exibe a quantidade de vagas disponíveis
                    vagasInfo.textContent = 'Vagas disponíveis: ' + vagasDisponiveis;

                    // Preenche as novas opções
                    response.forEach(function(item) {
                        var diaOption = document.createElement('option');
                        diaOption.value = item.id_dia;
                        diaOption.textContent = item.nomedia;
                        diaSelect.appendChild(diaOption);

                        var horarioOption = document.createElement('option');
                        horarioOption.value = item.id_hr;
                        horarioOption.textContent = item.horario;
                        horarioSelect.appendChild(horarioOption);

                        var sedeOption = document.createElement('option');
                        sedeOption.value = item.id_sede;
                        sedeOption.textContent = item.nomesede;
                        sedeSelect.appendChild(sedeOption);
                    });

                    // Verifica se as vagas estão esgotadas
                    if (vagasDisponiveis <= 0) {
                        alert('As inscrições para este curso foram encerradas.');
                    }

                    // Adiciona evento de mudança na sede
                    sedeSelect.addEventListener('change', function() {
                        var idSede = this.value;

                        if (idSede) {
                            var xhrTurmas = new XMLHttpRequest();
                            xhrTurmas.open('POST', '../model/GetTurmaSede.php', true);
                            xhrTurmas.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                            xhrTurmas.onload = function() {
                                if (xhrTurmas.status === 200) {
                                    var responseTurmas = JSON.parse(xhrTurmas.responseText);
                                    var turmaSelect = document.getElementById('id_turma');

                                    // Limpa as opções atuais
                                    turmaSelect.innerHTML = '<option value="">Selecione a turma</option>';

                                    if (responseTurmas.length > 0) {
                                        // Preenche as novas opções
                                        responseTurmas.forEach(function(item) {
                                            var turmaOption = document.createElement('option');
                                            turmaOption.value = item.id_turma;
                                            turmaOption.textContent = item.nometurma;
                                            turmaSelect.appendChild(turmaOption);
                                        });
                                    } else {
                                        turmaSelect.innerHTML = '<option value="">Nenhuma turma disponível</option>';
                                    }
                                }
                            };

                            xhrTurmas.send('id_sede=' + idSede);
                        } else {
                            document.getElementById('id_turma').innerHTML = '<option value="">Selecione a turma</option>';
                        }
                    });
                } else {
                    vagasInfo.textContent = 'Nenhuma informação disponível para este curso.';
                }
            }
        };

        xhr.send('id_curso=' + idCurso);
    } else {
        document.getElementById('id_dia').innerHTML = '<option value="">Selecione o dia</option>';
        document.getElementById('id_hr').innerHTML = '<option value="">Selecione o horário</option>';
        document.getElementById('id_sede').innerHTML = '<option value="">Selecione a sede</option>';
        document.getElementById('total_vagas').textContent = '';
    }
});

// Adiciona evento ao botão de inscrição
document.getElementById('inscrever').addEventListener('click', function() {
    var idCurso = document.getElementById('cursos').value;
    var nomeAluno = document.getElementById('nomealuno').value;
    var anoLet = document.getElementById('anolet').value;
    var idDia = document.getElementById('id_dia').value;
    var idHr = document.getElementById('id_hr').value;
    var emailAluno = document.getElementById('emailaluno').value;
    var idSede = document.getElementById('id_sede').value;
    var idTurma = document.getElementById('id_turma').value;

    if (idCurso && nomeAluno && anoLet && idDia && idHr && emailAluno && idSede && idTurma) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../model/RegistrarInscricao.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);

                if (response.status === 'success') {
                    // Atualiza a quantidade de vagas disponíveis
                    document.getElementById('cursos').dispatchEvent(new Event('change'));
                }
            }
        };

        var params = 'id_curso=' + idCurso + 
                     '&nomealuno=' + encodeURIComponent(nomeAluno) + 
                     '&anolet=' + encodeURIComponent(anoLet) + 
                     '&id_dia=' + encodeURIComponent(idDia) + 
                     '&id_hr=' + encodeURIComponent(idHr) + 
                     '&emailaluno=' + encodeURIComponent(emailAluno) + 
                     '&id_sede=' + encodeURIComponent(idSede) + 
                     '&id_turma=' + encodeURIComponent(idTurma);

        xhr.send(params);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});
