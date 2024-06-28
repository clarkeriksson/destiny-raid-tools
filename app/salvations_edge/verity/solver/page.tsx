"use client";

import React, { useEffect, useState } from "react";

const Shapes2D = {
    circle: [1, 0, 0],
    square: [0, 1, 0],
    triangle: [0, 0, 1],
}

type Shapes2DName = keyof typeof Shapes2D;
enum Shapes2DIndex {
    circle = 0,
    square = 1,
    triangle = 2,
}

const Shapes3D = {
    sphere: [2, 0, 0],
    cube: [0, 2, 0],
    pyramid: [0, 0, 2],
    cone: [1, 0, 1],
    cylinder: [1, 1, 0],
    prism: [0, 1, 1],
}

type Shapes3DName = keyof typeof Shapes3D;

enum Positions {
    left = 0,
    middle = 1,
    right = 2,
}

export default function Page(): React.ReactNode {

    /*
        ----------C--S--T-
        left-----[a, b, c]
        middle---[d, e, f]
        right----[g, h, i]
    */

    const [guardian2DShapes, setGuardian2DShapes] = useState<Array<Shapes2DName>>(["circle", "square", "triangle"]);
    const [guardian3DShapes, setGuardian3DShapes] = useState<Array<Shapes3DName>>(["sphere", "cube", "pyramid"]);

    const [steps, setSteps] = useState<Array<string>>([]);

    useEffect(() => {
        
        if (validateInputs(guardian2DShapes, guardian3DShapes)) {
        
            setSteps(solveDissect(guardian2DShapes, guardian3DShapes));

        } else {

            setSteps(["Invalid inputs."]);

        }

    }, [guardian2DShapes, guardian3DShapes]);

    function setGuardian2DShapeAt(index: number, shape: Shapes2DName): void {
    
        const newGuardian2DShapes = [...guardian2DShapes];
        if (newGuardian2DShapes.includes(shape)) {
            const oldIndex = newGuardian2DShapes.indexOf(shape);
            newGuardian2DShapes[oldIndex] = newGuardian2DShapes[index];
        }
        newGuardian2DShapes[index] = shape;
        setGuardian2DShapes(newGuardian2DShapes);
    
    }

    function setGuardian3DShapeAt(index: number, shape: Shapes3DName): void {
    
        const newGuardian3DShapes = [...guardian3DShapes];
        newGuardian3DShapes[index] = shape;
        setGuardian3DShapes(newGuardian3DShapes);
    
    }

    return (

        <div className={`w-full h-full flex flex-col place-self-center justify-center gap-4`}>

            <div className={`flex flex-row gap-10 place-self-center`}>
                {
                    [0, 1, 2].map(val => {
                        return (
                            <div key={val} className={`flex flex-col gap-2`}>
                                <div className={`flex flex-row gap-0 border-2 border-black w-max`} key={val}>
                                    {
                                        Object.keys(Shapes2D).map((shape: string) => {
                                            return (
                                                <img key={shape} src={`/salvations_edge/verity/${shape}.svg`} className={`w-[64px] h-[64px] cursor-pointer ${(guardian2DShapes[val] === shape) ? 'bg-gray-300' : 'hover:bg-blue-100'}`} onClick={() => setGuardian2DShapeAt(val, shape as Shapes2DName)}/>
                                            )
                                        })
                                    }
                                </div>
                                <div className={`grid grid-rows-2 grid-cols-3 border-2 border-black gap-0 w-max`} key={val+3}>
                                    {
                                        Object.keys(Shapes3D).map((shape: string) => {
                                            return (
                                                <img key={shape} src={`/salvations_edge/verity/${shape}.svg`} className={`w-[64px] h-[64px] cursor-pointer ${(guardian3DShapes[val] === shape) ? 'bg-gray-300' : 'hover:bg-blue-100'}`} onClick={() => setGuardian3DShapeAt(val, shape as Shapes3DName)}/>
                                            )
                                        })
                                    }
                                </div>                  
                            </div>
                        )
                    })
                }
            </div>
    
            <div className={`flex flex-col place-self-center h-[3em]`}>

                {
                    steps.map((step, index) => (
                        <div key={index} className={`text-2xl`}>{step}</div>
                    ))
                }

            </div>
        
        </div>

    )

}

function solveDissect(guardian2DShapes: Array<Shapes2DName>, guardian3DShapes: Array<Shapes3DName>): any {

    const matrix2D = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    const matrix3D = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

    for (let i = 0; i < guardian2DShapes.length; i++) {

        matrix2D.add(matrixOf2DShapeAt(guardian2DShapes[i], i));

    }

    for (let i = 0; i < guardian3DShapes.length; i++) {

        matrix3D.add(matrixOf3DShapeAt(guardian3DShapes[i], i));

    }

    const stepMatrix = Matrix.returnSubtraction(new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]), matrix2D, matrix3D);

    const steps: React.ReactNode[] = [];

    //console.log(JSON.parse(JSON.stringify(stepMatrix)).data);

    let i = 0;
    let stepCounter = 0;
    while (i < 3) {

        const removeIndex1 = stepMatrix.data[i].findIndex(val => val < 0);

        for (var j of [0, 1, 2].filter(val => val !== i)) {
            if (stepMatrix.data[j][removeIndex1] > 0) {
                const removeIndex2 = stepMatrix.data[j].findIndex(val => val < 0);

                const rowjChange = stepMatrix.data[j].map((val, index) => ([removeIndex1, removeIndex2].includes(index) ? Math.sign(val) : 0));

                const newRowi = stepMatrix.data[i].map((val, index) => val + rowjChange[index]);
                const newRowj = stepMatrix.data[j].map((val, index) => val - rowjChange[index]);

                stepMatrix.data[i] = newRowi;
                stepMatrix.data[j] = newRowj;

                steps.push(<>{`${stepCounter+1}) Dissect`} <b>{Shapes2DIndex[removeIndex1]}</b> {`from`} <b>{Positions[i]}</b> {`and then`} <b>{Shapes2DIndex[removeIndex2]}</b> {`from`} <b>{Positions[j]}</b></>);
                stepCounter++;

                //console.log(JSON.parse(JSON.stringify(stepMatrix)).data);

                break;
            }
        }

        i++;
        
    }

    return steps;

}

function validateInputs(guardian2DShapes: Array<Shapes2DName>, guardian3DShapes: Array<Shapes3DName>): boolean {

    let result = true;

    if (guardian2DShapes.length !== 3 || guardian3DShapes.length !== 3) {
        result = false;
    }

    const matrix3D = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    for (let i = 0; i < guardian3DShapes.length; i++) {

        matrix3D.add(matrixOf3DShapeAt(guardian3DShapes[i], i));

    }

    const columnSums3D = matrix3D.data.map((_, index) => matrix3D.data.reduce((acc, val) => acc + val[index], 0));

    if (columnSums3D.some(val => val !== 2)) {
        result = false;
    }

    const matrix2D = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    for (let i = 0; i < guardian2DShapes.length; i++) {

        matrix2D.add(matrixOf2DShapeAt(guardian2DShapes[i], i));

    }

    const columnSums2D = matrix2D.data.map((_, index) => matrix2D.data.reduce((acc, val) => acc + val[index], 0));

    if (columnSums2D.some(val => val !== 1)) {
        result = false;
    }

    return result;

}

function matrixOf2DShapeAt(shape: Shapes2DName, position: number): Matrix {

    const result = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

    result.data[position] = Shapes2D[shape];

    return result;

}

function matrixOf3DShapeAt(shape: Shapes3DName, position: number): Matrix {

    const result = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

    result.data[position] = Shapes3D[shape];

    return result;

}

class Matrix {
    
    public data: Array<Array<number>>;

    constructor(data: Array<Array<number>>) {

        this.data = data;

    }

    public add(matrix: Matrix): void {

        for (let i = 0; i < this.data.length; i++) {

            for (let j = 0; j < this.data[i].length; j++) {

                this.data[i][j] += matrix.data[i][j];

            }

        }

    }

    public subtract(matrix: Matrix): void {

        for (let i = 0; i < this.data.length; i++) {

            for (let j = 0; j < this.data[i].length; j++) {

                this.data[i][j] -= matrix.data[i][j];

            }

        }

    }

    public static returnSubtraction(matrix1: Matrix, ...matrices: Matrix[]): Matrix {
    
        const result = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

        for (let i = 0; i < matrix1.data.length; i++) {

            for (let j = 0; j < matrix1.data[i].length; j++) {

                result.data[i][j] = matrix1.data[i][j];

                for (let k = 0; k < matrices.length; k++) {

                    result.data[i][j] -= matrices[k].data[i][j];

                }

            }

        }

        return result;
    
    }

}