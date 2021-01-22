{
	let task = {
  		tags: [],
		name: "",
		time: 0,
		points: 0
	};
}

Task
  = Tag* Name Value

Name "name"
	= name:[^\t\n\r#:-]+ {
    task.name = name.join('')
	return task
    }

Tag "tag"
	= i:"#" text:Char _ { 
    task.tags.push(text.join(''))
	return task
    }
    
Value "value" = Time / Points    
    
Time "time"
	= i:":" _ time:Integer _ { 
    task.time = time
	return task
    }
    
Points "points"
	= i:"-" _ points:Integer _ { 
    task.points = points
	return task
    }
    
Char 
	= [^ \t\n\r#:-]+

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
