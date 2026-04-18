# Regras De Negocio

## Objetivo

Definir as regras que orientam o funcionamento do InfraCare na versão atual, garantindo consistência entre a interface, a API e o modelo de dados.

## Autenticacao E Acesso

1. O acesso ao sistema exige autenticação por e-mail e senha.
2. Após login bem-sucedido, o backend emite JWT para consumo nas rotas protegidas.
3. O frontend só libera a navegação interna quando houver token válido armazenado localmente.
4. O backend deve rejeitar acessos sem token ou com token inválido.
5. Rotas protegidas também devem respeitar o papel do usuário autenticado.

## Papéis De Usuario

1. `ADMIN` tem acesso mais amplo aos módulos operacionais e à auditoria.
2. `ANALYST` acompanha dashboards, relatórios, auditoria e indicadores.
3. `TECHNICIAN` atua nas rotas operacionais de incidentes, tickets, ativos e status.
4. `MANAGER` acompanha visão executiva, SLA, relatórios e usuários.

## Regras De Operacao

1. O dashboard deve consolidar a leitura da operação em uma única visão.
2. Os módulos de ativos, incidentes, tickets, checklists, SLA, status e relatórios devem exibir dados objetivos e resumidos.
3. Os registros exibidos na interface atual podem vir de dados de demonstração enquanto a persistência real não estiver integrada.
4. O healthcheck deve permanecer público para facilitar validação local e monitoramento básico.

## Regras De Incidentes

1. Todo incidente deve estar associado a uma unidade e a um setor.
2. Quando aplicável, um incidente pode ser vinculado a um ativo específico.
3. O incidente deve carregar severidade, status, causa raiz e ação corretiva quando houver evolução do caso.
4. A timeline do incidente deve registrar a evolução operacional do atendimento.

## Regras De Ativos

1. Todo ativo deve pertencer a uma unidade e a um setor.
2. O ativo deve possuir status atual e criticidade.
3. Mudanças de status devem ser registradas para permitir histórico operacional.
4. O intervalo de checagem deve refletir a estratégia de monitoramento do ativo.

## Regras De Tickets

1. Todo ticket deve possuir número único.
2. O ticket deve carregar prioridade, status, solicitante, unidade e setor.
3. Quando houver responsável técnico, ele deve ser identificado no ticket.
4. O ticket deve manter timeline de eventos para rastreabilidade.

## Regras De Checklists

1. Um checklist pode ser definido por periodicidade e categoria.
2. A execução do checklist deve ser vinculada a template, unidade, setor e responsável.
3. Itens de checklist podem receber marcação de criticidade.
4. A execução deve permitir resultado por item e observações complementares.

## Regras De SLA

1. As metas de SLA são definidas por prioridade e podem ser associadas a setor.
2. Indicadores de SLA devem mostrar leitura consolidada de conformidade.
3. A visão de SLA deve permitir identificar rapidamente o que está dentro ou fora da meta.

## Regras De Auditoria

1. Ações de escrita relevantes devem gerar evidência auditável.
2. O registro de auditoria deve conter ação, entidade, descrição e IP quando disponível.
3. A auditoria não deve bloquear a resposta principal da API.
4. O acesso aos logs deve ser restrito a papéis apropriados.

## Regras De Status De Servicos

1. Cada serviço monitorado deve possuir status atual e histórico.
2. O painel de status deve destacar rapidamente serviços em condição crítica ou instável.
3. A leitura dos serviços deve ser simples o suficiente para uso operacional diário.

## Regras De Relatorios

1. Relatórios e exportações devem ser rastreáveis por tipo e autor quando disponíveis.
2. A interface deve priorizar a leitura executiva dos itens mais recentes.

## Regras De Consistencia

1. O frontend e o backend devem usar os mesmos conceitos de papel, status e unidade.
2. Mudanças relevantes em API, contrato de autenticação ou regras de negócio devem ser refletidas na documentação.
3. A migração do runtime em memória para persistência real não deve alterar o significado dos conceitos de domínio.

## Regras Temporarias Da Versao Atual

1. Os dados usados pela aplicação são de demonstração e não representam persistência real.
2. A auditoria atual está em memória nesta etapa.
3. O login de demonstração faz parte do fluxo controlado para validação local.

## Evolucao Esperada

1. Substituir dados em memória por banco real com Prisma.
2. Expandir regras de escrita para incidentes, tickets e checklists.
3. Adicionar políticas de revogação e renovação de token.
4. Integrar dashboards e relatórios com dados persistidos e auditáveis.
