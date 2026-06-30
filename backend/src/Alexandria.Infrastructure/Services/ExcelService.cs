using OfficeOpenXml;

namespace Alexandria.Infrastructure.Services;

public class ExcelService
{
    public async Task<List<T>> ImportAsync<T>(Stream fileStream, Func<Dictionary<string, string>, T> mapFunc)
    {
        using var package = new ExcelPackage();
        await package.LoadAsync(fileStream);
        var worksheet = package.Workbook.Worksheets[0];
        var rowCount = worksheet.Dimension.Rows;
        var colCount = worksheet.Dimension.Columns;
        var headers = new List<string>();
        for (int col = 1; col <= colCount; col++)
            headers.Add(worksheet.Cells[1, col].Text);

        var results = new List<T>();
        for (int row = 2; row <= rowCount; row++)
        {
            var dict = new Dictionary<string, string>();
            for (int col = 1; col <= colCount; col++)
                dict[headers[col - 1]] = worksheet.Cells[row, col].Text;
            results.Add(mapFunc(dict));
        }
        return results;
    }

    public byte[] Export<T>(IEnumerable<T> data, Dictionary<string, Func<T, object>> columns)
    {
        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Export");
        var colIndex = 1;
        foreach (var col in columns)
        {
            worksheet.Cells[1, colIndex].Value = col.Key;
            colIndex++;
        }

        var rowIndex = 2;
        foreach (var item in data)
        {
            colIndex = 1;
            foreach (var col in columns)
            {
                worksheet.Cells[rowIndex, colIndex].Value = col.Value(item);
                colIndex++;
            }
            rowIndex++;
        }

        worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
        return package.GetAsByteArray();
    }
}
