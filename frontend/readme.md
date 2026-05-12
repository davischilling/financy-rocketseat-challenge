# Descrição e requisitos funcionais do Front-end

Nesse projeto front-end será desenvolvido uma aplicação React que, em conjunto com a API, permite o gerenciamento de transações e categorias.

## Funcionalidades e Regras

Assim como na API, temos as seguintes funcionalidades e regras:

- [X] O usuário pode criar uma conta e fazer login
- [X] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [X] Deve ser possível criar uma transação
- [X] Deve ser possível deletar uma transação
- [X] Deve ser possível editar uma transação
- [X] Deve ser possível listar todas as transações
- [X] Deve ser possível criar uma categoria
- [X] Deve ser possível deletar uma categoria
- [X] Deve ser possível editar uma categoria
- [X] Deve ser possível listar todas as categorias

Além disso, também temos algumas regras importantes específicas para o front-end:

- [X] É obrigatória a criação de uma aplicação React usando GraphQL para consultas na API e Vite como bundler;
- [X] Siga o mais fielmente possível o layout do Figma;

## Páginas

Essa aplicação possui 6 páginas e dois modais com os formulários (Dialog):

- [X] A página raiz (/) que exibe:
  - [X] Tela de login caso o usuário esteja deslogado
  - [X] Tela dashboard caso usuário esteja logado
- [X] Página de cadastro (/signup)
- [X] Página de transações (/transactions)
- [X] Página de categorias (/categories)
- [X] Página de perfil (/profile)

## Variáveis ambiente

Todo projeto tem diversas configurações de variáveis que devem ser diferentes de acordo com o ambiente que ele é executado. Para isso, importante sabermos, de forma fácil e intuitiva, quais variáveis são essas. Então é obrigatório que esse projeto tenha um arquivo .env.example com as chaves necessárias:

```
VITE_BACKEND_URL=
```

## Boas Práticas

- [X] Comece o projeto pela aba Style Guide no Figma. Dessa forma, você prepara todo o seu tema, fontes e componentes e quando for criar as páginas vai ser bem mais tranquilo;
- [X] Assim com a experiência do usuário é importante (UX), a sua experiência no desenvolvimento (DX) também é muito importante. Por isso, apesar de ser possível criar essa aplicação sem nenhuma biblioteca, recomendamos utilizar algumas bibliotecas que vão facilitar tanto o desenvolvimento inicial quanto a manutenção do código;

## Requisitos Não Funcionais

É obrigatório o uso de:

- [X] Typescript
- [X] React
- [X] Vite sem framework
- [X] GraphQL

É flexível o uso de:

- [X] TailwindCSS
- [X] Shadcn
- [ ] React Query
- [ ] React Hook Form
- [ ] Zod
