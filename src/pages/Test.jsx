import React, { useState } from 'react';

const shapes = [
    { 
        name: 'Point', 
        description: 'A single location in space, often represented by a dot.', 
        diagram: (
            <svg width="100" height="100">
                {/* Draw a point */}
                <circle cx="50" cy="50" r="3" fill="black" />
            </svg>
        )
    },
    { 
        name: 'Line', 
        description: 'A straight path that extends infinitely in both directions.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a line */}
                <line x1="10" y1="10" x2="190" y2="190" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Line Segment', 
        description: 'A finite portion of a line, defined by two endpoints.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a line segment */}
                <line x1="30" y1="30" x2="170" y2="30" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Ray', 
        description: 'A portion of a line that extends indefinitely in one direction from a starting point.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a ray */}
                <line x1="30" y1="30" x2="170" y2="170" stroke="black" strokeWidth="2" />
                <circle cx="30" cy="30" r="3" fill="black" />
            </svg>
        )
    },
    { 
        name: 'Angle', 
        description: 'Formed by two rays or line segments with a common endpoint.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw an angle */}
                <line x1="30" y1="30" x2="170" y2="30" stroke="black" strokeWidth="2" />
                <line x1="30" y1="30" x2="100" y2="170" stroke="black" strokeWidth="2" />
                <circle cx="30" cy="30" r="3" fill="black" />
            </svg>
        )
    },
    { 
        name: 'Polygon', 
        description: 'A closed shape made up of line segments joined end to end. Examples include triangles, quadrilaterals, pentagons, etc.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a polygon */}
                <polygon points="100,10 40,198 190,78 10,78 160,198" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Triangle', 
        description: 'A polygon with three sides and three angles.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a triangle */}
                <polygon points="100,10 40,198 190,78" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Quadrilateral', 
        description: 'A polygon with four sides. Examples include rectangles, squares, parallelograms, trapezoids, etc.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a quadrilateral */}
                <polygon points="50,20 150,20 180,150 20,150" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Circle', 
        description: 'A set of all points equidistant from a fixed point called the center.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a circle */}
                <circle cx="100" cy="100" r="50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Ellipse', 
        description: 'A set of all points such that the sum of the distances from two fixed points (foci) is constant.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw an ellipse */}
                <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Parabola', 
        description: 'The set of all points equidistant from a fixed point (focus) and a fixed line (directrix).', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a parabola */}
                <path d="M10,190 Q100,-100 190,190" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Hyperbola', 
        description: 'The set of all points such that the difference of the distances from two fixed points (foci) is constant.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a hyperbola */}
                <path d="M10,100 Q100,190 190,100" fill="none" stroke="black" strokeWidth="2" />
                <path d="M10,100 Q100,10 190,100" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Arc', 
        description: 'A portion of the circumference of a circle.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw an arc */}
                <path d="M10,100 A90,90 0 0,1 190,100" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Sector', 
        description: 'The portion of a circle enclosed by two radii and an arc.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a sector */}
                <path d="M100,100 L190,100 A90,90 0 0,1 100,190 Z" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Trapezoid', 
        description: 'A quadrilateral with at least one pair of parallel sides.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a trapezoid */}
                <polygon points="40,20 160,20 130,150 70,150" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Rhombus', 
        description: 'A quadrilateral with all sides of equal length.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a rhombus */}
                <polygon points="100,10 170,100 100,190 30,100" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Regular Polygon', 
        description: 'A polygon with all sides and angles equal.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a regular polygon (hexagon) */}
                <polygon points="100,10 170,50 170,150 100,190 30,150 30,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Pentagon', 
        description: 'A polygon with five sides.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a pentagon */}
                <polygon points="100,10 170,50 150,150 50,150 30,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Hexagon', 
        description: 'A polygon with six sides.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a hexagon */}
                <polygon points="100,10 170,50 170,150 100,190 30,150 30,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Octagon', 
        description: 'A polygon with eight sides.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw an octagon */}
                <polygon points="100,10 150,30 190,100 170,150 100,190 50,170 10,100 30,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Sphere', 
        description: 'The set of all points in space equidistant from a fixed point (center).', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a sphere */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Cylinder', 
        description: 'A three-dimensional shape with two parallel circular bases connected by a curved surface.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a cylinder */}
                <rect x="30" y="10" width="140" height="180" fill="none" stroke="black" strokeWidth="2" />
                <ellipse cx="100" cy="10" rx="70" ry="20" fill="none" stroke="black" strokeWidth="2" />
                <ellipse cx="100" cy="190" rx="70" ry="20" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Cone', 
        description: 'A three-dimensional shape with a circular base and a single vertex.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a cone */}
                <polygon points="100,10 170,150 30,150" fill="none" stroke="black" strokeWidth="2" />
                <circle cx="100" cy="10" r="70" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Rectangular Prism', 
        description: 'A three-dimensional shape with six rectangular faces, opposite faces are congruent.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a rectangular prism */}
                <polygon points="30,10 170,10 200,50 60,50" fill="none" stroke="black" strokeWidth="2" />
                <polygon points="30,10 30,150 60,190 60,50" fill="none" stroke="black" strokeWidth="2" />
                <polygon points="170,10 170,150 200,190 200,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
    { 
        name: 'Pyramid', 
        description: 'A three-dimensional shape with a polygonal base and triangular faces that meet at a common vertex.', 
        diagram: (
            <svg width="200" height="200">
                {/* Draw a pyramid */}
                <polygon points="100,10 170,100 100,190 30,100" fill="none" stroke="black" strokeWidth="2" />
                <line x1="100" y1="10" x2="170" y2="100" stroke="black" strokeWidth="2" />
                <line x1="100" y1="10" x2="30" y2="100" stroke="black" strokeWidth="2" />
                <line x1="100" y1="190" x2="170" y2="100" stroke="black" strokeWidth="2" />
                <line x1="100" y1="190" x2="30" y2="100" stroke="black" strokeWidth="2" />
            </svg>
        )
    },
];

const ShapeInfo = ({ name, description, dimensions, diagram }) => (
    <div>
        <h2>{name}</h2>
        <p>{description}</p>
        {dimensions && (
            <div>
                {dimensions.map((dimension) => (
                    <p key={dimension.name}>{dimension.name}: {dimension.value}</p>
                ))}
            </div>
        )}
        <div>{diagram}</div>
    </div>
);

const App = () => {
    const [selectedShape, setSelectedShape] = useState(null);
    const [showDimensions, setShowDimensions] = useState(false);

    const handleShapeSelection = (shape) => {
        setSelectedShape(shape);
    };

    const handleDimensionToggle = () => {
        setShowDimensions(!showDimensions);
    };

    let dimensions = null;
    let diagram = null;
    if (selectedShape && showDimensions) {
        switch (selectedShape.name) {
            // Handle dimensions and diagrams for other shapes
            default:
                dimensions = [];
                diagram = null;
        }
    }

    return (
        <div className="App">
            <h1>Shape Explorer</h1>
            <div>
                <h2>Select a Shape:</h2>
                <ul>
                    {shapes.map((shape) => (
                        <li key={shape.name} onClick={() => handleShapeSelection(shape)}>
                            {shape.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <label htmlFor="showDimensions">
                    <input
                        type="checkbox"
                        id="showDimensions"
                        checked={showDimensions}
                        onChange={handleDimensionToggle}
                    />
                    Show Dimensions
                </label>
                {selectedShape && (
                    <ShapeInfo
                        name={selectedShape.name}
                        description={selectedShape.description}
                        dimensions={dimensions}
                        diagram={diagram}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
