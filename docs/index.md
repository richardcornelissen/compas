---
home: true
heroText: Compas
tagline: Unified backend tooling
actionText: Get started
actionLink: "/getting-started.html"
altActionText: Changelog
altActionLink: "/changelog.html"
footer: "MIT Licensed | Copyright © 2019-present Dirk de Visser"
features:
  - title: Flexible code generators
    details:
      "Code generate routers, validators, api clients and Postgres queries."
  - title: ES Modules first
    details:
      "Contains test, bench and script runner supporting only ES modules."
  - title: Common utilities
    details:
      "Comes with session handling, job queue, file storage, script runner and
      more."
---

## I'm a...

- [Backend developer](/#backend-developer)
- [Frontend developer](/#frontend-developer)
- [Manager](/#todo)

### Backend developer

Provide the HTTP api structure:

```js
const T = new TypeCreator("todo");
const R = T.router("/todo");

R.get("/list", "list").response({
  todos: [
    {
      id: T.uuid(),
      todo: T.string(),
      completed: T.boolean(),
    },
  ],
});
```

Add an implementation:

```js
todoHandlers.list = async (ctx, next) => {
  ctx.body = {
    todo: [
      {
        id: uuid(),
        todo: "Explore compas",
      },
    ],
  };

  return next();
};
```

Create a test:

```js
test("todo/controller", async (t) => {
  const apiClient = Axios.create({});
  await createTestAppAndClient(app, apiClient);

  t.test("list conforms to response structure", async (t) => {
    await todoApi.list();
    // Throws: validator.response.todo.list.boolean.type -> Missing boolean value at '$.todo[0].completed'
  });
});
```

And some icing on the cake, by generating some PostgreSQL queries:

```js
const T = new TypeCreator("database");

T.object("user")
  .keys({
    email: T.string().searchable(),
    name: T.string(),
  })
  .enableQueries({
    withDates: true,
  })
  .relations(T.oneToMany("posts", T.reference("database", "post")));

T.object("post")
  .keys({
    title: T.string(),
    body: T.string(),
  })
  .enableQueries({
    withSoftDeletes: true,
  })
  .relations(T.manyToOne("author", T.reference("database", "user"), "posts"));
```

With queries like the following:

```js
const [user] = await queryUser({ where: { email: "foo@bar.com" } }).exec(sql);
const usersWithPosts = await queryUser({ posts: {} }).exec(sql);

const postsForAuthor = await queryPost({ where: { author: user.id } }).exec(sql);
const [authorOfPost] = await queryUser({
  viaPosts: { where: { id: postsForAuthor[0].id } },
}).exec(sql);
// postsForAuthor[0].author == authorOfPost.id

await queries.userInsert(sql, { email: "bar@foo.com", name: "Compas " });

// soft delete
await queries.postUpdate(sql, {
  update: {
    deletedAt: new Date(),
  },
  where: { id: "c532ac2a-4489-4b50-a061-12b2aa9a5df2" },
});
// Search include soft deleted posts
await queryPost({ where: { deletedAtIncludeNotNull: true } });
// permanent delete
await queries.postDelete(sql, {
  id: "c532ac2a-4489-4b50-a061-12b2aa9a5df2",
});
```

### Frontend developer

Either import from a Compas server:

```js
const app = new App();
app.extend(
  await loadApiStructureFromRemote(Axios, "https://api.my-domain.com"),
);
app.generate({
  outputDirectory: "./src/generated",
  isBrowser: true,
});
```

Or import from an OpenAPI spec (alpha-quality :S):

```js
const app = new App();
app.extendWithOpenApi("todo", getAnOpenAPISpecAsPlainJavascriptObject());
app.generate({
  outputDirectory: "./src/generated",
  isBrowser: true,
});
```

And use the typed api client:

```ts
const todos: TodoListResponse = await apiTodoList();
```

Or use the generated react-query hooks:

```tsx
function renderTodo({ todoId }: TodoSingleParams) {
  // Generated react-query hook with typed results
  const { data } = useTodoSingle({ todoId });

  return <div>{/*...*/}</div>;
}
```

## How it works

Most of the above is achieved by a custom specification, a few code generators
and a bunch of time tweaking results to achieve a stable way of working. Which
benefits backend developers with less copy-pasting, easy 'interface'-testing and
less manual doc writing, and frontend developers with explorable and ready to
consume api's.

## Why

My work involved doing many small projects. I had a hard time backporting
incremental fixes to existing projects. To facilitate my needs more and to stop
copying and pasting things around, this project was born.

## New features

New features added should fall under the following categories:

- It improves the interface between api and client in some way. An example may
  be to support websockets in @compas/code-gen
- It improves the developer experience one way or another while developing an
  api For example the `compas docker` commands or various utilities provided by
  @compas/stdlib

Although some parts heavily rely on conventions set by the packages, we
currently aim not to be a framework. We aim to provide a good developer
experience, useful abstractions around the basics, and a stable backend <->
client interface.
