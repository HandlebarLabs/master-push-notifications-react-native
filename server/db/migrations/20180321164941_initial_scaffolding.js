exports.up = function(knex, Promise) {
  const chain = [];

  chain.push(
    knex.schema.createTable("questions", table => {
      table.increments("_id");
      table.text("question");
      table.integer("totalResponses");
      table.text("answers");
      table.boolean("asked");
      table.boolean("isCurrent");
    })
  );

  return Promise.all(chain);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("questions")]);
};
