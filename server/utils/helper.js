const SqltoCamelCase = function (data) {
  console.log(data);
  const newData = data.map((d) => {
    return {
      id: d.id,
      description: d.description,
      tasks: d.tasks,
      title: d.title,
      userId: d.userid,
      breakTime: d.breaktime,
      totalTime: d.totaltime,
    };
  });

  return newData;
};

module.exports = SqltoCamelCase;
