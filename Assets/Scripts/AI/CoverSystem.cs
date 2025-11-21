using UnityEngine;
using System.Collections.Generic;

namespace NotebookWar.AI
{
    public class CoverSystem : MonoBehaviour
    {
        [Header("Cover Settings")]
        [SerializeField] private LayerMask coverLayer;
        [SerializeField] private float coverCheckRadius = 15f;
        [SerializeField] private float coverHeight = 1.5f;
        
        private static CoverSystem instance;
        private List<CoverPoint> coverPoints = new List<CoverPoint>();

        public static CoverSystem Instance => instance;

        private void Awake()
        {
            if (instance == null)
            {
                instance = this;
                FindCoverPoints();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void FindCoverPoints()
        {
            GameObject[] coverObjects = GameObject.FindGameObjectsWithTag("Cover");
            
            foreach (GameObject cover in coverObjects)
            {
                CoverPoint point = new CoverPoint
                {
                    position = cover.transform.position,
                    isOccupied = false,
                    coverObject = cover
                };
                coverPoints.Add(point);
            }
        }

        public CoverPoint FindNearestCover(Vector3 fromPosition, Vector3 threatPosition)
        {
            CoverPoint bestCover = null;
            float bestScore = float.MinValue;

            foreach (CoverPoint cover in coverPoints)
            {
                if (cover.isOccupied) continue;

                float distance = Vector3.Distance(fromPosition, cover.position);
                if (distance > coverCheckRadius) continue;

                // Check if cover actually blocks line of sight to threat
                if (!IsValidCover(cover.position, threatPosition)) continue;

                // Score based on distance (closer is better) and cover effectiveness
                float score = (coverCheckRadius - distance) / coverCheckRadius;
                
                if (score > bestScore)
                {
                    bestScore = score;
                    bestCover = cover;
                }
            }

            return bestCover;
        }

        private bool IsValidCover(Vector3 coverPos, Vector3 threatPos)
        {
            Vector3 direction = (threatPos - coverPos).normalized;
            float distance = Vector3.Distance(coverPos, threatPos);
            
            return Physics.Raycast(coverPos + Vector3.up * 0.5f, direction, distance * 0.8f, coverLayer);
        }

        public void OccupyCover(CoverPoint cover)
        {
            if (cover != null)
                cover.isOccupied = true;
        }

        public void ReleaseCover(CoverPoint cover)
        {
            if (cover != null)
                cover.isOccupied = false;
        }
    }

    [System.Serializable]
    public class CoverPoint
    {
        public Vector3 position;
        public bool isOccupied;
        public GameObject coverObject;
    }
}