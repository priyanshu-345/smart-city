"""
PDF Report Generator for Smart City Resource Optimization System
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import os
import io
from matplotlib import pyplot as plt
import numpy as np

class PDFReportGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom styles for PDF"""
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#3498db'),
            spaceAfter=12,
            spaceBefore=12
        )
        
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=6
        )
    
    def create_chart_image(self, chart_data, chart_type='bar', title='Chart'):
        """Create a chart image for PDF"""
        fig, ax = plt.subplots(figsize=(8, 5))
        
        if chart_type == 'bar':
            ax.bar(chart_data['labels'], chart_data['values'], 
                   color=chart_data.get('colors', ['#3498db'] * len(chart_data['labels'])))
        elif chart_type == 'line':
            ax.plot(chart_data['labels'], chart_data['values'], 
                   marker='o', color='#3498db', linewidth=2)
        elif chart_type == 'pie':
            ax.pie(chart_data['values'], labels=chart_data['labels'], 
                  autopct='%1.1f%%', startangle=90)
        
        ax.set_title(title, fontsize=14, fontweight='bold', pad=20)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        
        # Save to bytes
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer
    
    def generate_report(self, stats, predictions, output_path):
        """Generate complete PDF report"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title
        story.append(Paragraph("Smart City Resource Optimization", self.title_style))
        story.append(Paragraph("Comprehensive Analysis Report", self.styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        
        # Report Info
        report_date = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        story.append(Paragraph(f"<b>Report Generated:</b> {report_date}", self.normal_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", self.heading_style))
        summary_text = f"""
        This report provides a comprehensive analysis of smart city resource optimization 
        across five key modules: Traffic Management, Energy Consumption, Water Demand, 
        Waste Collection, and Air Quality Monitoring. The analysis is based on {stats.get('total_predictions', 0)} 
        total predictions made using advanced machine learning models.
        """
        story.append(Paragraph(summary_text, self.normal_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Module Statistics Table
        story.append(Paragraph("Module Statistics", self.heading_style))
        
        data = [
            ['Module', 'Total Predictions', 'Key Metrics'],
            ['Traffic Management', 
             str(stats.get('traffic', {}).get('total', 0)), 
             f"High Congestion: {stats.get('traffic', {}).get('high_congestion', 0)}"],
            ['Energy Management', 
             str(stats.get('energy', {}).get('total', 0)), 
             f"Avg Consumption: {stats.get('energy', {}).get('avg_consumption', 0)} kWh"],
            ['Water Management', 
             str(stats.get('water', {}).get('total', 0)), 
             f"Avg Consumption: {stats.get('water', {}).get('avg_consumption', 0)} Liters"],
            ['Waste Management', 
             str(stats.get('waste', {}).get('total', 0)), 
             f"Collection Needed: {stats.get('waste', {}).get('collection_needed', 0)}"],
            ['Air Quality', 
             str(stats.get('air', {}).get('total', 0)), 
             f"Unhealthy Days: {stats.get('air', {}).get('unhealthy_days', 0)}"],
        ]
        
        table = Table(data, colWidths=[2*inch, 1.5*inch, 2.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ]))
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        # Module-wise Analysis
        modules = ['traffic', 'energy', 'water', 'waste', 'air']
        module_names = {
            'traffic': 'Traffic Management',
            'energy': 'Energy Management',
            'water': 'Water Management',
            'waste': 'Waste Management',
            'air': 'Air Quality Monitoring'
        }
        
        for module in modules:
            module_preds = [p for p in predictions if p.get('module') == module]
            if module_preds:
                story.append(PageBreak())
                story.append(Paragraph(module_names[module], self.heading_style))
                
                # Module statistics
                module_stats = stats.get(module, {})
                stats_text = f"""
                <b>Total Predictions:</b> {module_stats.get('total', 0)}<br/>
                """
                if module == 'traffic':
                    stats_text += f"<b>High Congestion Events:</b> {module_stats.get('high_congestion', 0)}"
                elif module == 'energy':
                    stats_text += f"<b>Average Consumption:</b> {module_stats.get('avg_consumption', 0)} kWh"
                elif module == 'water':
                    stats_text += f"<b>Average Consumption:</b> {module_stats.get('avg_consumption', 0)} Liters"
                elif module == 'waste':
                    stats_text += f"<b>Collections Needed:</b> {module_stats.get('collection_needed', 0)}"
                elif module == 'air':
                    stats_text += f"<b>Unhealthy Days:</b> {module_stats.get('unhealthy_days', 0)}"
                
                story.append(Paragraph(stats_text, self.normal_style))
                story.append(Spacer(1, 0.2*inch))
                
                # Recent predictions table
                story.append(Paragraph("Recent Predictions", self.styles['Heading3']))
                recent_preds = module_preds[:10]  # Last 10 predictions
                
                if recent_preds:
                    pred_data = [['Timestamp', 'Prediction Details']]
                    for pred in recent_preds:
                        timestamp = pred.get('timestamp', 'N/A')
                        if isinstance(timestamp, str):
                            try:
                                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                                timestamp = dt.strftime("%Y-%m-%d %H:%M")
                            except:
                                pass
                        
                        pred_details = pred.get('prediction', {})
                        details_str = ", ".join([f"{k}: {v}" for k, v in pred_details.items() if k != 'status'])
                        
                        pred_data.append([timestamp[:16], details_str[:80]])
                    
                    pred_table = Table(pred_data, colWidths=[2*inch, 4*inch])
                    pred_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#95a5a6')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, 0), 10),
                        ('FONTSIZE', (0, 1), (-1, -1), 8),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
                    ]))
                    story.append(pred_table)
        
        # Conclusion
        story.append(PageBreak())
        story.append(Paragraph("Conclusion & Recommendations", self.heading_style))
        conclusion_text = """
        <b>Key Findings:</b><br/>
        • The smart city resource optimization system has successfully processed multiple predictions across all modules.<br/>
        • Machine learning models are providing accurate forecasts for resource demand and optimization opportunities.<br/>
        • Real-time monitoring enables proactive decision-making for city resource management.<br/><br/>
        
        <b>Recommendations:</b><br/>
        • Continue monitoring predictions to identify patterns and trends.<br/>
        • Implement automated alerts for critical thresholds (high congestion, low air quality, etc.).<br/>
        • Regularly retrain models with new data to maintain accuracy.<br/>
        • Expand data collection points for more granular insights.<br/>
        """
        story.append(Paragraph(conclusion_text, self.normal_style))
        
        # Footer
        story.append(Spacer(1, 0.5*inch))
        footer_text = f"""
        <i>This report was generated by the Smart City Resource Optimization System.<br/>
        For questions or support, please contact the system administrator.</i>
        """
        story.append(Paragraph(footer_text, self.styles['Italic']))
        
        # Build PDF
        doc.build(story)
        return output_path



