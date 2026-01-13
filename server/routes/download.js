import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/download-pdf', async (req, res) => {
  try {
    const { courseCode, topQuestions, topicWeightage } = req.body;

    if (!courseCode || !topQuestions || !topicWeightage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required data for PDF generation'
      });
    }

    // Create PDF document with better margins
    const doc = new PDFDocument({ 
      margin: 60,
      size: 'A4',
      bufferPages: true
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ExamHack_${courseCode}_CheatSheet.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Colors
    const colors = {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      dark: '#1e293b',
      gray: '#64748b',
      light: '#94a3b8'
    };

    // ===== HEADER =====
    doc.fontSize(32).font('Helvetica-Bold').fillColor(colors.primary).text('ExamHack', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(20).font('Helvetica').fillColor(colors.dark).text(`${courseCode} Cheat Sheet`, { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(11).fillColor(colors.gray).text(`AI-Generated Study Guide | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
    
    // Decorative line
    doc.moveDown(1);
    doc.strokeColor(colors.primary).lineWidth(2)
       .moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.width - doc.page.margins.right, doc.y)
       .stroke();
    doc.moveDown(2);

    // ===== TOP QUESTIONS SECTION =====
    doc.fontSize(22).font('Helvetica-Bold').fillColor(colors.dark).text('Top 10 Most Repeated Questions');
    doc.moveDown(1.5);

    topQuestions.forEach((q, index) => {
      // Check if we need a new page
      if (doc.y > 650) {
        doc.addPage();
        doc.moveDown(1);
      }

      // Question rank badge
      const rankY = doc.y;
      doc.fontSize(16).font('Helvetica-Bold').fillColor('white');
      
      // Draw rank circle
      doc.circle(doc.page.margins.left + 15, rankY + 10, 18)
         .fillAndStroke(colors.primary, colors.primary);
      
      doc.fillColor('white').text(`${index + 1}`, doc.page.margins.left + (index < 9 ? 10 : 6), rankY + 3);

      // Topic and subtopic badges - positioned to the left
      const contentStartX = doc.page.margins.left + 45;
      let currentY = rankY;

      if (q.topic || q.subtopic) {
        let badgeX = contentStartX;
        
        if (q.topic) {
          doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.secondary);
          const topicWidth = doc.widthOfString(q.topic) + 16;
          doc.roundedRect(badgeX, currentY, topicWidth, 20, 10)
             .fillAndStroke(colors.secondary + '20', colors.secondary);
          doc.fillColor(colors.secondary).text(q.topic, badgeX + 8, currentY + 5);
          badgeX += topicWidth + 8;
        }

        if (q.subtopic) {
          doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.primary);
          const subtopicWidth = doc.widthOfString(q.subtopic) + 16;
          doc.roundedRect(badgeX, currentY, subtopicWidth, 20, 10)
             .fillAndStroke(colors.primary + '20', colors.primary);
          doc.fillColor(colors.primary).text(q.subtopic, badgeX + 8, currentY + 5);
        }
        
        currentY += 28; // Move down after badges
      }

      // Question text - starts after badges
      doc.y = currentY;
      doc.fontSize(11).font('Helvetica').fillColor(colors.dark)
         .text(q.text, contentStartX, doc.y, {
           align: 'left',
           lineGap: 3,
           width: doc.page.width - doc.page.margins.right - contentStartX
         });
      
      doc.moveDown(0.5);

      // Metadata
      doc.fontSize(9).font('Helvetica').fillColor(colors.gray)
         .text(`Appeared ${q.frequency}x  |  Years: ${q.years ? q.years.join(', ') : 'N/A'}`, {
           indent: 10
         });
      
      doc.moveDown(1.5);

      // Separator line
      if (index < topQuestions.length - 1) {
        doc.strokeColor(colors.light).lineWidth(0.5)
           .moveTo(doc.page.margins.left, doc.y)
           .lineTo(doc.page.width - doc.page.margins.right, doc.y)
           .stroke();
        doc.moveDown(1);
      }
    });

    // ===== TOPIC WEIGHTAGE SECTION =====
    doc.addPage();
    doc.fontSize(22).font('Helvetica-Bold').fillColor(colors.dark).text('Topic Weightage Analysis');
    doc.moveDown(1.5);

    topicWeightage.forEach((topic, index) => {
      // Topic name and percentage
      doc.fontSize(13).font('Helvetica-Bold').fillColor(colors.dark)
         .text(`${index + 1}. ${topic.name}`, { continued: true });
      doc.fontSize(13).font('Helvetica-Bold').fillColor(colors.primary)
         .text(` ${topic.percentage}%`, { continued: false });
      
      doc.moveDown(0.3);

      // Progress bar
      const barWidth = 400;
      const barHeight = 12;
      const fillWidth = (topic.percentage / 100) * barWidth;

      // Background bar
      doc.roundedRect(doc.page.margins.left + 20, doc.y, barWidth, barHeight, 6)
         .fillAndStroke('#e2e8f0', '#e2e8f0');

      // Filled bar
      doc.roundedRect(doc.page.margins.left + 20, doc.y, fillWidth, barHeight, 6)
         .fillAndStroke(colors.primary, colors.primary);

      doc.moveDown(0.8);

      // Question count
      doc.fontSize(10).font('Helvetica').fillColor(colors.gray)
         .text(`${topic.count} questions`, { indent: 20 });
      
      doc.moveDown(1.2);
    });

    // ===== STUDY TIPS SECTION =====
    doc.addPage();
    doc.fontSize(22).font('Helvetica-Bold').fillColor(colors.dark).text('Smart Study Tips');
    doc.moveDown(1.5);

    const tips = [
      { title: 'Top 5 Questions Are Your Best Friends', text: 'Focus on the top 5 questions - they have the highest probability of appearing in your exam!' },
      { title: 'High Weightage Topics First', text: 'Prioritize topics with higher weightage for maximum marks in minimum time.' },
      { title: 'Repeat Questions = Easy Marks', text: 'Questions appearing in multiple years are strong indicators of important concepts.' },
      { title: 'Frequency 4+ = Must Do', text: 'Questions with frequency 4 or higher should be your top priority.' },
      { title: 'Last Minute Strategy', text: 'If time is limited, focus on #1, #2, #3 questions and you\'ll be good to go!' }
    ];

    tips.forEach((tip, index) => {
      // Bullet point
      doc.fontSize(12).font('Helvetica-Bold').fillColor(colors.dark);
      doc.circle(doc.page.margins.left, doc.y + 6, 3).fill(colors.primary);
      doc.text(tip.title, doc.page.margins.left + 15, doc.y - 6);
      
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').fillColor(colors.gray)
         .text(tip.text, { 
           indent: 15,
           align: 'justify',
           lineGap: 2
         });
      doc.moveDown(1.2);
    });

    // ===== FOOTER =====
    doc.moveDown(2);
    doc.strokeColor(colors.light).lineWidth(0.5)
       .moveTo(doc.page.margins.left, doc.y)
       .lineTo(doc.page.width - doc.page.margins.right, doc.y)
       .stroke();
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica').fillColor(colors.gray)
       .text('Generated by ExamHack - Your AI-Powered Exam Prep Assistant', { align: 'center' });
    doc.fontSize(8).fillColor(colors.light)
       .text('This cheat sheet is based on AI analysis of past exam papers', { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
});

export default router;
