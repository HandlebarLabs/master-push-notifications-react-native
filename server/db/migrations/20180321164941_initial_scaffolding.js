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

  chain.push(
    knex.schema.createTable("pushNotifications", table => {
      table.increments("_id");
      table.text("token");
      table.string("platform");
      table.integer("timezoneOffset").defaultTo(240); // Default to EST
    })
  );

  return Promise.all(chain);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("questions")]);
};
