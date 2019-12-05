on('IssueEvent', function (e)
  addLabel(e.number, 'label-test')
end)
