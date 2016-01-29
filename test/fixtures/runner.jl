# To run this script, `cd` to the `./test/fixtures` directory and then, from the Julia terminal, `include("./runner.jl")`.

import JSON

x = linspace( 1e-400, 1e-1, 100000 )

y = log1p( x )
println( y )

data = Dict([
	("data", x),
	("expected", y)
])

outfile = open( "./test/fixtures/small.json", "w" )
JSON.json( data )

write( outfile, JSON.json(data) )
close( outfile )


x = linspace( 1e1, 1e300, 100000 )

y = log1p( x )
println( y )

data = Dict([
	("data", x),
	("expected", y)
])

outfile = open( "./test/fixtures/large.json", "w" )
JSON.json( data )

write( outfile, JSON.json(data) )
close( outfile )