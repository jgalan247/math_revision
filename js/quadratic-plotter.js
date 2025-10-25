// Quadratic Function Plotter - Plots quadratic functions using Canvas

class QuadraticPlotter {
    constructor() {
        this.plotters = new Map();
    }

    /**
     * Create a plot for a quadratic function
     * @param {string} containerId - Container element ID
     * @param {number} a - Coefficient a
     * @param {number} b - Coefficient b
     * @param {number} c - Coefficient c
     * @param {number} questionIndex - Question index
     */
    createPlot(containerId, a, b, c, questionIndex) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        // Create canvas and controls wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'quadratic-plot-wrapper';
        wrapper.id = `plot-wrapper-${questionIndex}`;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = `plot-canvas-${questionIndex}`;
        canvas.width = 600;
        canvas.height = 400;
        canvas.className = 'quadratic-canvas';

        // Create info panel
        const infoPanel = document.createElement('div');
        infoPanel.className = 'quadratic-info';
        infoPanel.id = `plot-info-${questionIndex}`;

        wrapper.appendChild(canvas);
        wrapper.appendChild(infoPanel);
        container.appendChild(wrapper);

        // Store reference
        this.plotters.set(questionIndex, {
            canvas: canvas,
            info: infoPanel,
            a: a,
            b: b,
            c: c
        });

        // Draw the plot
        this.drawPlot(questionIndex);

        return wrapper;
    }

    /**
     * Update and redraw plot with new coefficients
     */
    updatePlot(questionIndex, a, b, c) {
        const plotter = this.plotters.get(questionIndex);
        if (!plotter) return;

        plotter.a = a;
        plotter.b = b;
        plotter.c = c;

        this.drawPlot(questionIndex);
    }

    /**
     * Draw the quadratic function on canvas
     */
    drawPlot(questionIndex) {
        const plotter = this.plotters.get(questionIndex);
        if (!plotter) return;

        const { canvas, info, a, b, c } = plotter;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Calculate scale and center
        const margin = 40;
        const plotWidth = width - 2 * margin;
        const plotHeight = height - 2 * margin;

        // Calculate vertex and range
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;

        // Determine x range based on vertex
        const xRange = Math.max(15, Math.abs(vertexX) * 2 + 5);
        const xMin = vertexX - xRange / 2;
        const xMax = vertexX + xRange / 2;

        // Calculate y range
        const yValues = [];
        for (let x = xMin; x <= xMax; x += 0.5) {
            yValues.push(a * x * x + b * x + c);
        }
        const yMin = Math.min(...yValues, vertexY - 5);
        const yMax = Math.max(...yValues, vertexY + 5);

        // Scale functions
        const scaleX = (x) => margin + ((x - xMin) / (xMax - xMin)) * plotWidth;
        const scaleY = (y) => height - margin - ((y - yMin) / (yMax - yMin)) * plotHeight;

        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        // Vertical grid lines
        const xStep = Math.max(1, Math.floor((xMax - xMin) / 10));
        for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += xStep) {
            const sx = scaleX(x);
            ctx.beginPath();
            ctx.moveTo(sx, margin);
            ctx.lineTo(sx, height - margin);
            ctx.stroke();
        }

        // Horizontal grid lines
        const yStep = Math.max(1, Math.floor((yMax - yMin) / 8));
        for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += yStep) {
            const sy = scaleY(y);
            ctx.beginPath();
            ctx.moveTo(margin, sy);
            ctx.lineTo(width - margin, sy);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        // X-axis
        if (yMin <= 0 && yMax >= 0) {
            const yAxisPos = scaleY(0);
            ctx.beginPath();
            ctx.moveTo(margin, yAxisPos);
            ctx.lineTo(width - margin, yAxisPos);
            ctx.stroke();
        }

        // Y-axis
        if (xMin <= 0 && xMax >= 0) {
            const xAxisPos = scaleX(0);
            ctx.beginPath();
            ctx.moveTo(xAxisPos, margin);
            ctx.lineTo(xAxisPos, height - margin);
            ctx.stroke();
        }

        // Draw parabola
        ctx.strokeStyle = '#2196f3';
        ctx.lineWidth = 3;
        ctx.beginPath();

        let firstPoint = true;
        for (let x = xMin; x <= xMax; x += (xMax - xMin) / 200) {
            const y = a * x * x + b * x + c;
            const sx = scaleX(x);
            const sy = scaleY(y);

            if (firstPoint) {
                ctx.moveTo(sx, sy);
                firstPoint = false;
            } else {
                ctx.lineTo(sx, sy);
            }
        }
        ctx.stroke();

        // Draw vertex
        ctx.fillStyle = '#f44336';
        ctx.beginPath();
        ctx.arc(scaleX(vertexX), scaleY(vertexY), 5, 0, 2 * Math.PI);
        ctx.fill();

        // Calculate roots if they exist
        const discriminant = b * b - 4 * a * c;
        let roots = null;
        if (discriminant >= 0) {
            const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            roots = [root1, root2];

            // Draw roots
            ctx.fillStyle = '#4caf50';
            if (yMin <= 0 && yMax >= 0) {
                const yAxisPos = scaleY(0);
                roots.forEach(root => {
                    ctx.beginPath();
                    ctx.arc(scaleX(root), yAxisPos, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        }

        // Draw axis labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        // X-axis labels
        for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += xStep) {
            if (x !== 0) {
                const sx = scaleX(x);
                const yAxisPos = (yMin <= 0 && yMax >= 0) ? scaleY(0) : height - margin;
                ctx.fillText(x.toString(), sx, yAxisPos + 20);
            }
        }

        // Y-axis labels
        ctx.textAlign = 'right';
        for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += yStep) {
            if (y !== 0) {
                const sy = scaleY(y);
                const xAxisPos = (xMin <= 0 && xMax >= 0) ? scaleX(0) : margin;
                ctx.fillText(y.toString(), xAxisPos - 10, sy + 5);
            }
        }

        // Update info panel
        this.updateInfoPanel(questionIndex, a, b, c, vertexX, vertexY, roots, discriminant);
    }

    /**
     * Update the information panel
     */
    updateInfoPanel(questionIndex, a, b, c, vertexX, vertexY, roots, discriminant) {
        const plotter = this.plotters.get(questionIndex);
        if (!plotter) return;

        const { info } = plotter;

        let html = `
            <div class="plot-info-row">
                <strong>Function:</strong> y = ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}
            </div>
            <div class="plot-info-row">
                <strong>Vertex:</strong> (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})
            </div>
            <div class="plot-info-row">
                <strong>Opens:</strong> ${a > 0 ? 'Upward ⌣' : 'Downward ⌢'}
            </div>
            <div class="plot-info-row">
                <strong>Discriminant:</strong> b² - 4ac = ${discriminant.toFixed(2)}
            </div>
        `;

        if (discriminant > 0) {
            html += `
                <div class="plot-info-row">
                    <strong>Roots:</strong> x₁ = ${roots[0].toFixed(2)}, x₂ = ${roots[1].toFixed(2)}
                </div>
                <div class="plot-info-row">
                    <span class="info-badge success">Two real roots</span>
                </div>
            `;
        } else if (discriminant === 0) {
            html += `
                <div class="plot-info-row">
                    <strong>Root:</strong> x = ${roots[0].toFixed(2)} (double root)
                </div>
                <div class="plot-info-row">
                    <span class="info-badge warning">One repeated root</span>
                </div>
            `;
        } else {
            html += `
                <div class="plot-info-row">
                    <span class="info-badge error">No real roots (complex roots)</span>
                </div>
            `;
        }

        info.innerHTML = html;
    }

    /**
     * Remove plot
     */
    removePlot(questionIndex) {
        const plotter = this.plotters.get(questionIndex);
        if (plotter) {
            const wrapper = document.getElementById(`plot-wrapper-${questionIndex}`);
            if (wrapper) {
                wrapper.remove();
            }
            this.plotters.delete(questionIndex);
        }
    }
}

// Global instance
const quadraticPlotter = new QuadraticPlotter();
