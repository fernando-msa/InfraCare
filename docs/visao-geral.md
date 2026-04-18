# Visao Geral

## Proposito

O InfraCare é uma plataforma web para apoio à operação hospitalar, com foco em monitoramento de ativos, tratamento de incidentes, gestão de tickets, checklists, SLA, auditoria e status de serviços.

## Publico Alvo

- Equipes de TI hospitalar.
- NOC e suporte operacional.
- Analistas de infraestrutura e auditoria.
- Gestores que acompanham indicadores e relatórios.

## Escopo Atual

Nesta versão, o sistema entrega:

- autenticação local com JWT;
- layout protegido no frontend;
- navegação por módulos operacionais;
- dados de demonstração em memória;
- healthcheck público para operação;
- documentação de evidências locais.

## Beneficio Esperado

- Centralizar a leitura da operação em uma interface única.
- Reduzir perda de rastreabilidade em incidentes e auditorias.
- Facilitar validação local antes da integração com banco real.
- Servir como base para evolução gradual até um produto pronto para uso.

## Limites Da Versao Atual

- Não há persistência real no runtime atual.
- A auditoria persiste em memória nesta etapa.
- A camada de dados usa registros de demonstração para manter o bootstrap leve.
- Algumas integrações de produção ainda estão planejadas no roadmap.
