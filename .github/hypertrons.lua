on('IssueEvent', function (e)
  if (e.action == 'opened')
  then   
    addLabel(e.number, 'label-test')
  end
end)
